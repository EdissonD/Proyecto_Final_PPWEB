import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProgramadoresService, ProgramadorPublicoDTO } from '../../../../services/programadores';
import { NotificacionesService } from '../../../../services/notificaciones';

@Component({
  selector: 'app-editar-programador',
  standalone: true,
  templateUrl: './editar.html',
  styleUrls: ['./editar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class EditarComponent implements OnInit {
  form!: FormGroup;
  id!: string;

  preview: string = '';
  archivoFotoNuevo: File | null = null;

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private programadoresService: ProgramadoresService,
    private router: Router,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      especialidad: ['', Validators.required],

      // si en editar también tienes estos campos, déjalos:
      disponibilidad: [''],
      horasDisponiblesTexto: ['']
    });

    this.cargarDatos();
  }

  cargarDatos() {
    if (!this.id) return;

    this.programadoresService.getProgramador(this.id).subscribe({
      next: (data: ProgramadorPublicoDTO) => {
        this.form.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          especialidad: data.especialidad || '',
          disponibilidad: data.disponibilidad || '',
          horasDisponiblesTexto: (data.horasDisponibles || []).join(', ')
        });

        this.preview = data.foto || '';
      },
      error: (e) => {
        console.error(e);
        this.noti.error('No se pudo cargar el programador');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.archivoFotoNuevo = file;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result as string);
    reader.readAsDataURL(file);
  }

  guardarCambios() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.noti.error('Completa los campos obligatorios');
      return;
    }

    this.cargando = true;

    const v = this.form.value;

    const horasDisponibles: string[] = (v.horasDisponiblesTexto || '')
      .split(',')
      .map((h: string) => h.trim())
      .filter((h: string) => !!h);

    const fd = new FormData();

    // ✅ EXACTO como espera tu backend
    fd.append('nombre', v.nombre);
    fd.append('descripcion', v.descripcion);
    fd.append('especialidad', v.especialidad);

    // ✅ backend espera "disponibilidad"
    if (v.disponibilidad) fd.append('disponibilidad', v.disponibilidad);

    // ✅ backend espera "horasDisponibles" como JSON string
    if (horasDisponibles.length) fd.append('horasDisponibles', JSON.stringify(horasDisponibles));

    // ✅ backend espera "file"
    if (this.archivoFotoNuevo) fd.append('file', this.archivoFotoNuevo);

    this.programadoresService.updateProgramador(this.id, fd).subscribe({
      next: () => {
        this.noti.exito('Programador actualizado correctamente');
        this.router.navigate(['/admin/programadores']);
      },
      error: (e) => {
        console.error(e);
        this.noti.error('Error al actualizar el programador');
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }
}
