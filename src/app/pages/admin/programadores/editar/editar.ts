import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ProgramadoresService, Programador } from '../../../../services/programadores';

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

  // Variables para manejo de foto (del primer código)
  preview: string = '';
  archivoFotoNuevo: File | null = null; 

  cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private programadoresService: ProgramadoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    // Fusión de campos: Estándar + Nuevos del segundo código
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      especialidad: ['', Validators.required],
      github: [''],
      linkedin: [''],
      portafolio: [''], // Mantenemos portafolio del código 1
      
      // Nuevos campos del código 2
      emailContacto: [''],
      whatsapp: [''],
      horasDisponiblesTexto: [''] // Campo auxiliar para el array de horas
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.programadoresService.getProgramador(this.id)
      .subscribe((data: Programador | undefined) => { // Ajuste de tipo por si es undefined
        if (!data) return;

        // Rellenar formulario (Fusión de lógica)
        this.form.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          especialidad: data.especialidad,
          github: data.github || '',
          linkedin: data.linkedin || '',
          portafolio: data.portafolio || '',
          
          // Nuevos campos
          emailContacto: data.emailContacto || '',
          whatsapp: data.whatsapp || '',
          // Convertir array a string para el input
          horasDisponiblesTexto: data.horasDisponibles?.join(', ') || ''
        });

        // Mostrar foto actual (Lógica del código 1)
        if (data.foto) { // o data.fotoUrl, según como se llame en tu BD
          this.preview = data.foto;
        }
      });
  }

  // Lógica de selección de archivo (del código 1)
  onFileSelected(event: any) {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    this.archivoFotoNuevo = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async guardarCambios() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    // 1. Obtener valores del form
    const value = this.form.value;

    // 2. Lógica del código 2: Convertir texto a array de horas
    let horasDisponibles: string[] = [];
    if (value.horasDisponiblesTexto) {
      horasDisponibles = value.horasDisponiblesTexto
        .split(',')
        .map((h: string) => h.trim())
        .filter((h: string) => h !== '');
    }

    // 3. Preparar objeto de datos
    // Usamos Partial<Programador> y fusionamos todo
    const datos: Partial<Programador> = {
      nombre: value.nombre,
      descripcion: value.descripcion,
      especialidad: value.especialidad,
      github: value.github,
      linkedin: value.linkedin,
      portafolio: value.portafolio,
      emailContacto: value.emailContacto,
      whatsapp: value.whatsapp,
      horasDisponibles: horasDisponibles 
    };

    try {
      // 4. Llamar al servicio manteniendo la firma del código 1 (ID, datos, Archivo)
      await this.programadoresService.updateProgramador(
        this.id,
        datos,
        this.archivoFotoNuevo 
      );

      alert('Programador actualizado correctamente');
      this.router.navigate(['/admin/programadores']);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al actualizar el programador');
    } finally {
      this.cargando = false;
    }
  }
}