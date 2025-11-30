import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
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

  // para la foto
  preview: string = '';          // foto actual o nueva (para mostrar)
  archivoFotoNuevo: File | null = null;  // archivo nuevo si el usuario cambia la foto

  cargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private programadoresService: ProgramadoresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Tomamos el id de la URL
    this.id = this.route.snapshot.paramMap.get('id')!;

    // 2. Creamos el formulario con los campos de tu interfaz
    this.form = this.fb.group({
      nombre: [''],
      descripcion: [''],
      especialidad: [''],
      github: [''],
      linkedin: [''],
      portafolio: ['']
      // foto no se pone aquí porque la manejamos con preview + archivo
    });

    // 3. Cargamos los datos del programador desde Firestore
    this.programadoresService.getProgramador(this.id)
      .subscribe((data: Programador) => {
        if (!data) { return; }

        // rellenar formulario
        this.form.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          especialidad: data.especialidad,
          github: data.github || '',
          linkedin: data.linkedin || '',
          portafolio: data.portafolio || ''
        });

        // mostrar foto actual
        if (data.foto) {
          this.preview = data.foto;
        }
      });
  }

  //  cuando el usuario selecciona una nueva foto
  onFileSelected(event: any) {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    this.archivoFotoNuevo = file;

    // previsualizar imagen
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async guardarCambios() {
    if (this.form.invalid) return;

    this.cargando = true;

    const datos: Partial<Programador> = this.form.value;

    try {
      await this.programadoresService.updateProgramador(
        this.id,
        datos,
        this.archivoFotoNuevo   // puede ser null si no cambió foto
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
