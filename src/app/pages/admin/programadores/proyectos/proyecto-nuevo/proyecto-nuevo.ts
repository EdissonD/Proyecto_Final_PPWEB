import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProyectosService, Proyecto } from '../../../../../services/proyectos';

@Component({
  selector: 'app-proyecto-nuevo',
  standalone: true,
  templateUrl: './proyecto-nuevo.html',
  styleUrls: ['./proyecto-nuevo.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProyectoNuevoComponent implements OnInit {

  form!: FormGroup;
  idProgramador!: string;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['academico', Validators.required],
      participacion: ['frontend', Validators.required],
      tecnologias: ['', Validators.required],
      repo: [''],
      demo: ['']
    });
  }

  async guardar() {
    if (this.form.invalid) return;

    this.cargando = true;

    const data: Proyecto = this.form.value;

    try {
      await this.proyectosService.crearProyecto(this.idProgramador, data);
      alert('Proyecto creado');
      this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
    } catch (err) {
      console.error(err);
      alert('Error al crear proyecto');
    } finally {
      this.cargando = false;
    }
  }
}
