import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MenuComponent } from '../../components/menu/menu';
import { ProyectosService, Proyecto } from '../../services/proyectos';
import { AuthService } from '../../services/auth';
import { NotificacionesService } from '../../services/notificaciones';

type Modo = 'lista' | 'nuevo' | 'editar';

@Component({
  selector: 'app-programador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './programador.html',
  styleUrls: ['./programador.scss'],
})
export class ProgramadorComponent implements OnInit {
  usuario: any | null = null;
  proyectos: Proyecto[] = [];

  cargando = true;
  modo: Modo = 'lista';
  proyectoEditando: Proyecto | null = null;

  form!: FormGroup;

  constructor(
    private auth: AuthService,
    private proyectosService: ProyectosService,
    private fb: FormBuilder,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tecnologias: ['', Validators.required],
      urlRepo: [''],
      urlDemo: ['']
    });

    this.auth.usuario$.subscribe(u => {
      this.usuario = u;
      const idProgramador = this.getIdProgramador(u);

      if (idProgramador) this.cargarProyectos(idProgramador);
      else this.cargando = false;
    });
  }

  private getIdProgramador(u: any): string | null {
    return u?.idProgramador || u?.programadorId || null;
  }

  private cargarProyectos(idProgramador: string) {
    this.cargando = true;
    this.proyectosService.obtenerPorProgramador(idProgramador).subscribe({
      next: (lista) => {
        this.proyectos = lista || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.noti.error('No se pudieron cargar los proyectos.');
        this.cargando = false;
      }
    });
  }

  nuevoProyecto() {
    this.modo = 'nuevo';
    this.proyectoEditando = null;
    this.form.reset({ titulo: '', descripcion: '', tecnologias: '', urlRepo: '', urlDemo: '' });
  }

  editarProyecto(p: Proyecto) {
    this.modo = 'editar';
    this.proyectoEditando = p;
    this.form.patchValue({
      titulo: p.titulo,
      descripcion: p.descripcion,
      tecnologias: p.tecnologias,
      urlRepo: p.urlRepo || '',
      urlDemo: p.urlDemo || ''
    });
  }

  cancelarEdicion() {
    this.modo = 'lista';
    this.proyectoEditando = null;
    this.form.reset();
  }

  guardarProyecto() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.noti.error('Completa los campos requeridos.');
      return;
    }

    const v = this.form.value;
    this.cargando = true;

    if (this.modo === 'nuevo') {
      const body: Omit<Proyecto, 'id'> = {
        titulo: v.titulo,
        descripcion: v.descripcion,
        tecnologias: v.tecnologias,
        urlRepo: v.urlRepo || '',
        urlDemo: v.urlDemo || '',
        creadoEn: new Date().toISOString()
      };

      this.proyectosService.crearProyecto(body).subscribe({
        next: () => {
          this.noti.exito('Proyecto creado correctamente.');
          this.postGuardarOk();
        },
        error: (err) => {
          console.error(err);
          this.noti.error('Ocurrió un error al crear el proyecto.');
          this.cargando = false;
        }
      });

      return;
    }

    if (this.modo === 'editar' && this.proyectoEditando?.id) {
      const cambios: Partial<Proyecto> = {
        titulo: v.titulo,
        descripcion: v.descripcion,
        tecnologias: v.tecnologias,
        urlRepo: v.urlRepo || '',
        urlDemo: v.urlDemo || ''
      };

      this.proyectosService.actualizarProyecto(this.proyectoEditando.id, cambios).subscribe({
        next: () => {
          this.noti.exito('Proyecto actualizado correctamente.');
          this.postGuardarOk();
        },
        error: (err) => {
          console.error(err);
          this.noti.error('Ocurrió un error al actualizar el proyecto.');
          this.cargando = false;
        }
      });

      return;
    }

    this.cargando = false;
  }

  private postGuardarOk() {
    this.modo = 'lista';
    this.proyectoEditando = null;
    this.form.reset();

    const idProgramador = this.getIdProgramador(this.usuario);
    if (idProgramador) this.cargarProyectos(idProgramador);
    else this.cargando = false;
  }

  async eliminarProyecto(p: Proyecto) {
    if (!p.id) return;

    const ok = await Promise.resolve(
      this.noti.confirmar('¿Eliminar este proyecto?', 'Esta acción no se puede deshacer.')
    );
    if (!ok) return;

    this.cargando = true;

    this.proyectosService.eliminarProyecto(p.id).subscribe({
      next: () => {
        this.noti.exito('Proyecto eliminado correctamente.');
        const idProgramador = this.getIdProgramador(this.usuario);
        if (idProgramador) this.cargarProyectos(idProgramador);
        else this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.noti.error('Ocurrió un error al eliminar el proyecto.');
        this.cargando = false;
      }
    });
  }

  trackByProyecto(_: number, p: Proyecto) {
    return p.id;
  }
}
