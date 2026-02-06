import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProgramadoresService, ProgramadorPublicoDTO, ProgramadorGuardarDTO } from '../../../../services/programadores';
import { NotificacionesService } from '../../../../services/notificaciones';
import { CloudinaryService } from '../../../../services/cloudinary.service';

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
    private cloudinary: CloudinaryService,
    private router: Router,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      especialidad: ['', Validators.required],
      disponibilidad: [''],
      horasDisponiblesTexto: [''] // "09:00, 10:30"
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

    const enviar = (fotoUrl?: string | null) => {
      const body: ProgramadorGuardarDTO = {
        nombre: v.nombre,
        descripcion: v.descripcion,
        especialidad: v.especialidad,
        disponibilidad: v.disponibilidad || null,
        horasDisponibles,
        // si no hay nueva foto, NO cambias fotoUrl (manda null solo si quieres borrarla)
        fotoUrl: fotoUrl ?? null,
      };

      this.programadoresService.updateProgramador(this.id, body).subscribe({
        next: () => {
          this.noti.exito('Programador actualizado correctamente');
          this.router.navigate(['/admin/programadores']);
        },
        error: (e) => {
          console.error(e);
          this.noti.error('Error al actualizar el programador');
          this.cargando = false;
        },
        complete: () => (this.cargando = false)
      });
    };

    // Si NO cambió foto: no mandes fotoUrl (mejor) → pero tu DTO manda null.
    // Si quieres mantener la anterior, aquí lo correcto es NO enviar el campo.
    // Para mantener simple: si no hay nueva foto, mandamos null SOLO si quieres permitir "borrar foto".
    // Te recomiendo: si no cambió foto, NO tocar fotoUrl -> manda undefined:

    if (!this.archivoFotoNuevo) {
      // alternativa mejor:
      const body: ProgramadorGuardarDTO = {
        nombre: v.nombre,
        descripcion: v.descripcion,
        especialidad: v.especialidad,
        disponibilidad: v.disponibilidad || null,
        horasDisponibles
      };

      this.programadoresService.updateProgramador(this.id, body).subscribe({
        next: () => {
          this.noti.exito('Programador actualizado correctamente');
          this.router.navigate(['/admin/programadores']);
        },
        error: (e) => {
          console.error(e);
          this.noti.error('Error al actualizar el programador');
          this.cargando = false;
        },
        complete: () => (this.cargando = false)
      });
      return;
    }

    // Si cambió foto, sube a Cloudinary y manda URL
    this.cloudinary.uploadImage(this.archivoFotoNuevo).subscribe({
      next: ({ url }) => enviar(url),
      error: (e) => {
        console.error(e);
        this.noti.error('Error subiendo imagen a Cloudinary');
        this.cargando = false;
      }
    });
  }
}
