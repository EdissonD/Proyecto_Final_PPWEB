import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ProyectosService, Proyecto } from '../../../../../services/proyectos';
import { NotificacionesService } from '../../../../../services/notificaciones';

@Component({
  selector: 'app-proyecto-nuevo',
  standalone: true,
  templateUrl: './proyecto-nuevo.html',
  styleUrls: ['./proyecto-nuevo.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProyectoNuevoComponent implements OnInit {

  form!: FormGroup;
  idProgramador = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id') || '';

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: ['', Validators.required],
      urlRepo: [''],
      urlDemo: ['']
    });
  }

  guardar() {
    if (this.form.invalid) return;

    this.cargando = true;
    const v = this.form.value;

    // ⚠️ OJO: si tu backend exige idProgramador, debes incluirlo en el modelo Proyecto
    // (o enviarlo como parámetro al endpoint). Si NO lo exige, déjalo así.
    const proyecto: Proyecto = {
      titulo: v.titulo,
      descripcion: v.descripcion,
      tecnologias: v.tecnologias,
      urlRepo: v.urlRepo || '',
      urlDemo: v.urlDemo || '',
      creadoEn: new Date().toISOString()
    } as Proyecto;

    this.proyectosService.crearProyecto(proyecto).subscribe({
      next: () => {
        this.noti.exito('Proyecto creado correctamente');
        this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
      },
      error: (e) => {
        console.error(e);
        this.noti.error('Error al crear el proyecto');
        this.cargando = false;
      },
      complete: () => (this.cargando = false)
    });
  }

  cancelar() {
    this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
  }
}
