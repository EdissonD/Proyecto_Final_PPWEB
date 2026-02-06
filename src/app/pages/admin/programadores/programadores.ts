import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ProgramadoresService, ProgramadorGuardarDTO } from '../../../services/programadores';
import { NotificacionesService } from '../../../services/notificaciones';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'app-programador-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './programador-nuevo.html',
  styleUrls: ['./programador-nuevo.scss']
})
export class ProgramadorNuevoComponent {

  form: FormGroup;
  archivoFoto: File | null = null;
  previewUrl: string | null = null;

  cargando = false;

  constructor(
    private fb: FormBuilder,
    private programadoresService: ProgramadoresService,
    private cloudinary: CloudinaryService,
    private router: Router,
    private noti: NotificacionesService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      especialidad: ['', Validators.required],

      github: [''],
      linkedin: [''],
      portafolio: [''],
      emailContacto: [''],
      whatsapp: [''],

      disponibilidad: [''],
      horasDisponiblesTexto: [''] // "09:00, 10:30, 16:00"
    });
  }

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.archivoFoto = null;
      this.previewUrl = null;
      return;
    }

    this.archivoFoto = input.files[0];

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(this.archivoFoto);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.noti.error('Completa los campos obligatorios');
      return;
    }

    if (!this.archivoFoto) {
      this.noti.error('Debes seleccionar una imagen');
      return;
    }

    this.cargando = true;

    const v = this.form.value;

    const horasDisponibles: string[] = (v.horasDisponiblesTexto || '')
      .split(',')
      .map((h: string) => h.trim())
      .filter((h: string) => !!h);

    // 1) Subir a Cloudinary
    this.cloudinary.uploadImage(this.archivoFoto).subscribe({
      next: ({ url }) => {
        // 2) Enviar JSON al backend
        const body: ProgramadorGuardarDTO = {
          nombre: v.nombre,
          descripcion: v.descripcion,
          especialidad: v.especialidad,
          fotoUrl: url,

          emailContacto: v.emailContacto || null,
          github: v.github || null,
          linkedin: v.linkedin || null,
          portafolio: v.portafolio || null,
          whatsapp: v.whatsapp || null,

          disponibilidad: v.disponibilidad || null,
          horasDisponibles
        };

        this.programadoresService.crearProgramador(body).subscribe({
          next: () => {
            this.noti.exito('Programador agregado correctamente');
            this.router.navigate(['/admin/programadores']);
          },
          error: (e) => {
            console.error(e);
            this.noti.error('Error guardando en el backend');
            this.cargando = false;
          }
        });
      },
      error: (e) => {
  console.error('CLOUDINARY ERROR FULL:', e);
  console.error('STATUS:', e?.status);
  console.error('BODY:', e?.error); // aquí viene el mensaje real de cloudinary

  const msg =
    e?.error?.error?.message || // cloudinary suele mandar { error: { message } }
    e?.error?.message ||
    'Error subiendo imagen a Cloudinary';

  this.noti.error(msg);
  this.cargando = false;
}

    });
  }       }