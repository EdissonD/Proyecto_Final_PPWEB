import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms'; // Agregado FormGroup
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

  // 1. Declaramos la variable primero
  form!: FormGroup;

  idProgramador!: string;
  idProyecto!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService
  ) {
    // 2. Inicializamos el formulario AQUÍ, dentro del constructor
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
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')!;
    this.cargar();
  }

  cargar() {
    this.proyectosService.getProyecto(
      this.idProgramador,
      this.idProyecto
    ).subscribe((p: Proyecto | null) => {
      if (!p) return;

      this.form.patchValue({
        nombre: p.nombre,
        descripcion: p.descripcion,
        tipoProyecto: p.tipoProyecto,
        participacion: p.participacion,
        repoUrl: p.repoUrl || '',
        demoUrl: p.demoUrl || '',
        tecnologiasTexto: p.tecnologias.join(', ')
      });
    });
  }

  async guardar() {
    const v = this.form.value;

    const tecnologias = v.tecnologiasTexto
      ?.split(',')
      ?.map((t: string) => t.trim())
      ?.filter((t: string) => t !== '') || [];

    const data = {
      nombre: v.nombre!,
      descripcion: v.descripcion!,
      tipoProyecto: v.tipoProyecto as any,
      participacion: v.participacion as any,
      repoUrl: v.repoUrl || '',
      demoUrl: v.demoUrl || '',
      tecnologias
    };

    await this.proyectosService.updateProyecto(
      this.idProgramador,
      this.idProyecto,
      data
    );
    alert('Proyecto actualizado');
    this.router.navigate(['/admin/programadores', this.idProgramador, 'proyectos']);
  }
}