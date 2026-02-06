import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProgramadoresService, ProgramadorPublicoDTO } from '../../../services/programadores';
import { ProyectosService, Proyecto } from '../../../services/proyectos';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  templateUrl: './portafolio.html',
  styleUrls: ['./portafolio.scss'],
  imports: [CommonModule, RouterModule],
})
export class PortafolioComponent implements OnInit {

  programador: ProgramadorPublicoDTO | null = null;
  proyectos: Proyecto[] = [];

  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private programadoresService: ProgramadoresService,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    const idProgramador = this.route.snapshot.paramMap.get('id') || '';

    if (!idProgramador) {
      this.cargando = false;
      return;
    }

    // 1) programador
    this.programadoresService.getProgramador(idProgramador).subscribe({
      next: (p) => (this.programador = p),
      error: (err) => {
        console.error(err);
        this.programador = null;
      },
    });

    // 2) proyectos del programador (backend)
    this.proyectosService.obtenerPorProgramador(idProgramador).subscribe({
      next: (lista) => {
        this.proyectos = (lista || []) as Proyecto[];
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.proyectos = [];
        this.cargando = false;
      },
    });
  }

  trackByProyecto(_: number, p: Proyecto) {
    return p.id || p.titulo;
  }

  techs(p: Proyecto): string[] {
    if (!p.tecnologias) return [];
    return p.tecnologias.split(',').map(t => t.trim()).filter(Boolean);
  }
}
