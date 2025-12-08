import { ProyectosService, Proyecto } from '../../../../../services/proyectos';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { NotificacionesService } from '../../../../../services/notificaciones';

@Component({
  selector: 'app-proyectos-admin',
  standalone: true,
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProyectosAdminComponent implements OnInit {

  idProgramador!: string;
  proyectos: Proyecto[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectosService: ProyectosService,
    private noti: NotificacionesService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;

    this.proyectosService
      .getProyectosDeProgramador(this.idProgramador)
      .subscribe({
        next: (proys) => {
          this.proyectos = proys;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
          this.noti.error('No se pudieron cargar los proyectos');
        }
      });
  }

  nuevoProyecto() {
    this.router.navigate([
      '/admin',
      'programadores',
      this.idProgramador,
      'proyectos',
      'nuevo'
    ]);
  }

  editarProyecto(idProyecto: string) {
    this.router.navigate([
      '/admin',
      'programadores',
      this.idProgramador,
      'proyectos',
      'editar',
      idProyecto
    ]);
  }

  async eliminarProyecto(idProyecto: string) {

    // 🔥 Ahora usamos la confirmación PRO del sistema, NO alert()
    const confirmado = await this.noti.confirmar(
      '¿Eliminar proyecto?',
      'Esta acción es permanente y no se puede deshacer.'
    );

    if (!confirmado) return;

    try {
      await this.proyectosService.eliminarProyecto(idProyecto);

      this.noti.exito('Proyecto eliminado correctamente');

      // recargar lista
      this.proyectos = this.proyectos.filter(p => p.id !== idProyecto);

    } catch (err) {
      console.error(err);
      this.noti.error('No se pudo eliminar el proyecto');
    }
  }
}
