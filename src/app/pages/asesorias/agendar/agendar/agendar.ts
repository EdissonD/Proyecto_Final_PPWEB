import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AsesoriasService } from '../../../../services/asesorias';
import { ProgramadoresService, ProgramadorPublicoDTO } from '../../../../services/programadores';
import { NotificacionesService } from '../../../../services/notificaciones';

registerLocaleData(localeEs);

@Component({
  selector: 'app-agendar-asesoria',
  standalone: true,
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AgendarAsesoriaComponent implements OnInit {

  form!: FormGroup;
  idProgramador!: string;

  programador: ProgramadorPublicoDTO | null = null;
  cargando = false;

  horasDisponibles: string[] = [];

  hoy!: Date;
  hoyStr!: string;
  fechaSeleccionada!: Date;
  fechaSeleccionadaStr!: string;

  // slots del día
  disponibilidadDiaSeleccionado: { hora: string; ocupado: boolean; }[] = [];

  // ocupadas backend
  ocupadas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asesoriasService: AsesoriasService,
    private programadoresService: ProgramadoresService,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('idProgramador')!;

    // Fechas
    this.hoy = this.normalizarFecha(new Date());
    this.fechaSeleccionada = new Date(this.hoy);
    this.hoyStr = this.formatearFecha(this.hoy);
    this.fechaSeleccionadaStr = this.hoyStr;

    this.form = this.fb.group({
      nombreSolicitante: ['', Validators.required],
      emailSolicitante: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      comentario: ['']
    });

    // Programador (backend)
    this.programadoresService.getProgramador(this.idProgramador).subscribe({
      next: (p) => {
        this.programador = p || null;
        // OJO: backend DTO usa horasDisponibles (igual que tu modelo)
        this.horasDisponibles = p?.horasDisponibles || [];
        this.actualizarOcupadasYSlots();
      },
      error: (e) => console.error(e)
    });

    // Inicial: cargar ocupadas
    this.actualizarOcupadasYSlots();
  }

  private normalizarFecha(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }

  private formatearFecha(fecha: Date): string {
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private actualizarOcupadasYSlots() {
    const fechaStr = this.formatearFecha(this.fechaSeleccionada);
    this.fechaSeleccionadaStr = fechaStr;

    if (!this.idProgramador) return;

    // ✅ backend: horas ocupadas
    this.asesoriasService.getOcupadas(this.idProgramador, fechaStr).subscribe({
      next: (lista) => {
        this.ocupadas = lista || [];
        this.actualizarDisponibilidadDiaSeleccionado();
      },
      error: (err) => {
        console.error(err);
        this.ocupadas = [];
        this.actualizarDisponibilidadDiaSeleccionado();
      }
    });
  }

  private actualizarDisponibilidadDiaSeleccionado() {
    if (!this.horasDisponibles || this.horasDisponibles.length === 0) {
      this.disponibilidadDiaSeleccionado = [];
      return;
    }

    const fechaStr = this.fechaSeleccionadaStr;

    this.disponibilidadDiaSeleccionado = this.horasDisponibles.map((horaSlot) => {
      // backend devuelve asesorías con fecha/hora y estado != rechazada
      const ocupado = this.ocupadas.some((a: any) =>
        (a?.fecha === fechaStr) &&
        (a?.hora?.startsWith(horaSlot) || a?.hora === horaSlot) &&
        (String(a?.estado || '').toLowerCase() !== 'rechazada')
      );

      return { hora: horaSlot, ocupado };
    });
  }

  diaSiguiente() {
    this.fechaSeleccionada = this.normalizarFecha(
      new Date(this.fechaSeleccionada.getTime() + 86400000)
    );
    this.actualizarOcupadasYSlots();
  }

  diaAnterior() {
    const fechaAnterior = this.normalizarFecha(
      new Date(this.fechaSeleccionada.getTime() - 86400000)
    );
    if (this.formatearFecha(fechaAnterior) < this.hoyStr) return;

    this.fechaSeleccionada = fechaAnterior;
    this.actualizarOcupadasYSlots();
  }

  seleccionarHora(slot: { hora: string; ocupado: boolean }) {
    if (slot.ocupado) return;

    this.form.patchValue({
      fecha: this.fechaSeleccionadaStr,
      hora: slot.hora
    });
  }

  enviarSolicitud() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.noti.error('Debes completar todos los campos obligatorios');
      return;
    }

    this.cargando = true;
    const v = this.form.value;

    // ✅ backend: formato exacto esperado
    const body = {
      idProgramador: this.idProgramador,
      nombreSolicitante: v.nombreSolicitante,
      emailSolicitante: v.emailSolicitante,
      fecha: v.fecha,
      hora: v.hora,
      comentario: v.comentario || ''
    };

    this.asesoriasService.crearPublica(body as any).subscribe({
      next: () => {
        this.noti.exito('Tu solicitud fue enviada correctamente. El programador la revisará.');
        this.router.navigate(['/portafolio', this.idProgramador]);
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.noti.error('Ocurrió un error al enviar la solicitud');
        this.cargando = false;
      }
    });
  }

  trackByHora(_: number, slot: any) {
    return slot.hora;
  }
}
