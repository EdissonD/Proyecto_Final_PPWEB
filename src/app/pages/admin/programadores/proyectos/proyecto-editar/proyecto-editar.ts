import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProyectosService, Proyecto } from '../../../../../services/proyectos';

@Component({
  selector: 'app-proyecto-editar',
  standalone: true,
  templateUrl: './proyecto-editar.html',
  styleUrls: ['./proyecto-editar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProyectoEditarComponent implements OnInit {

  form!: FormGroup;
  idProgramador!: string;
  idProyecto!: string;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')!;

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['academico', Validators.required],
      participacion: ['frontend', Validators.required],
      tecnologias: ['', Validators.required],
      repo: [''],
      demo: ['']
    });

    this.proyectosService
      .getProyecto(this.idProgramador, this.idProyecto)
      .subscribe((p: Proyecto) => {
        this.form.patchValue(p);
      });
  }

  async guardar() {
    if (this.form.invalid) return;

    this.cargando = true;

    try {
      await this.proyectosService.updateProyecto(
        this.idProgramador,
        this.idProyecto,
        this.form.value
      );

      alert('Proyecto actualizado');
      this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar proyecto');
    } finally {
      this.cargando = false;
    }
  }
}
