import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; // Agregamos FormGroup
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProyectosService } from '../../../../../services/proyectos';

@Component({
  selector: 'app-proyecto-nuevo',
  standalone: true,
  templateUrl: './proyecto-nuevo.html',
  styleUrls: ['./proyecto-nuevo.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProyectoNuevoComponent implements OnInit {

  // 1. Declaramos la variable (sin asignarle valor todavía)
  form!: FormGroup;

  cargando = false;
  idProgramador!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService
  ) {
    // 2. Inicializamos la variable con la estructura del formulario
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipoProyecto: ['', Validators.required],
      participacion: ['', Validators.required],
      tecnologiasTexto: [''],
      repoUrl: [''],
      demoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    // Usamos el operador ? para evitar errores si el campo es null
    const formValue = this.form.value;

    // Lógica para convertir el texto de tecnologías a array
    const tecnologias = formValue.tecnologiasTexto
      ?.split(',')
      ?.map((t: string) => t.trim())
      ?.filter((t: string) => t !== '') || [];

    const nuevoProyecto = {
      idProgramador: this.idProgramador,
      nombre: formValue.nombre!,
      descripcion: formValue.descripcion!,
      tipoProyecto: formValue.tipoProyecto as any,
      participacion: formValue.participacion as any,
      tecnologias,
      repoUrl: formValue.repoUrl || '',
      demoUrl: formValue.demoUrl || ''
    };

    try {
      await this.proyectosService.crearProyecto(this.idProgramador, nuevoProyecto);
      alert('Proyecto creado correctamente');
      this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
    } catch (error) {
      console.error(error);
      alert('Error al crear el proyecto');
    } finally {
      this.cargando = false;
    }
  }
}