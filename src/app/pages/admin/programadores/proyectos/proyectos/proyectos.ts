import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProyectosService, Proyecto } from '../../../../../services/proyectos';

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

  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectosService.getProyectos(this.idProgramador)
      .subscribe(proys => this.proyectos = proys);
  }

  async eliminarProyecto(idProyecto: string | undefined) {
    if (!idProyecto) return;
    if (!confirm('¿Seguro que deseas eliminar este proyecto?')) return;

    await this.proyectosService.deleteProyecto(this.idProgramador, idProyecto);
    this.cargarProyectos();
  }
}
