import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ProyectosService, Proyecto } from '../../../../../services/proyectos';
import { NotificacionesService } from '../../../../../services/notificaciones';

@Component({
  selector: 'app-proyecto-editar',
  standalone: true,
  templateUrl: './proyecto-editar.html',
  styleUrls: ['./proyecto-editar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProyectoEditarComponent implements OnInit {

  form!: FormGroup;
  idProgramador = '';
  idProyecto = '';
  cargando = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id') || '';
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto') || '';

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: ['', Validators.required],
      urlRepo: [''],
      urlDemo: ['']
    });

    // ✅ usa el método que realmente tengas en tu servicio:
    // Si tu servicio se llama getProyecto(id) cámbialo abajo.
    this.proyectosService.obtenerUno(this.idProyecto).subscribe({
      next: (p: Proyecto) => {
        this.form.patchValue({
          titulo: p.titulo || '',
          descripcion: p.descripcion || '',
          tecnologias: p.tecnologias || '',
          urlRepo: p.urlRepo || '',
          urlDemo: p.urlDemo || ''
        });
        this.cargando = false;
      },
      error: (e) => {
        console.error(e);
        this.noti.error('No se pudo cargar el proyecto');
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.form.invalid) return;

    this.cargando = true;
    const v = this.form.value;

    const cambios: Partial<Proyecto> = {
      titulo: v.titulo,
      descripcion: v.descripcion,
      tecnologias: v.tecnologias,
      urlRepo: v.urlRepo || '',
      urlDemo: v.urlDemo || ''
    };

    // ✅ si tu servicio retorna Observable:
    this.proyectosService.actualizarProyecto(this.idProyecto, cambios).subscribe({
      next: () => {
        this.noti.exito('Proyecto actualizado correctamente');
        this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
      },
      error: (e) => {
        console.error(e);
        this.noti.error('Error al actualizar el proyecto');
        this.cargando = false;
      },
      complete: () => (this.cargando = false)
    });
  }

  cancelar() {
    this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
  }
}
