import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsesoriasService } from '../../../../services/asesorias';
import { AuthService, UsuarioApp } from '../../../../services/auth';
import { NotificacionesService } from '../../../../services/notificaciones';

@Component({
  selector: 'app-programador-asesorias',
  standalone: true,
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
  imports: [CommonModule]
})
export class ProgramadorAsesoriasComponent implements OnInit {

  asesorias: any[] = [];
  cargando = true;

  mensajeSimulado: string | null = null;

  constructor(
    private asesoriasService: AsesoriasService,
    private auth: AuthService,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.auth.usuario$.subscribe((usuario: UsuarioApp | null) => {
      if (!usuario?.idProgramador) {
        this.cargando = false;
        this.asesorias = [];
        return;
      }

      // ✅ tu service actual: asesoriasProgramador() (sin id)
      this.asesoriasService.asesoriasProgramador().subscribe({
        next: (lista) => {
          this.asesorias = lista || [];
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.noti.error('No se pudieron cargar las asesorías');
          this.cargando = false;
        }
      });
    });
  }

  cambiarEstado(a: any, nuevoEstado: 'aprobada' | 'rechazada') {
    if (!a?.id) {
      this.noti.error('No se pudo identificar la asesoría');
      return;
    }

    const nombre = a.nombreSolicitante || 'Usuario';
    const fechaHora = `${a.fecha || ''} ${a.hora || ''}`;

    const textoBase =
      nuevoEstado === 'aprobada'
        ? `Hola ${nombre}, tu solicitud de asesoría para el ${fechaHora} ha sido APROBADA.`
        : `Hola ${nombre}, tu solicitud de asesoría para el ${fechaHora} ha sido RECHAZADA.`;

    this.asesoriasService.actualizarAsesoria(a.id, {
      estado: nuevoEstado,
      respuestaProgramador: textoBase
    }).subscribe({
      next: (upd) => {
        a.estado = nuevoEstado;
        a.respuestaProgramador = textoBase;

        this.noti.exito(nuevoEstado === 'aprobada' ? 'Asesoría aprobada' : 'Asesoría rechazada');

        this.mensajeSimulado =
`Simulación de notificación:
Para: ${a.emailSolicitante || '(sin email)'}
Mensaje:
${textoBase}`;
      },
      error: (err: any) => {
        console.error(err);
        this.noti.error('Error al actualizar el estado');
      }
    });
  }

  cerrarMensajeSimulado() {
    this.mensajeSimulado = null;
  }
}
