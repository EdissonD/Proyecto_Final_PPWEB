import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProgramadoresService, Programador } from '../../../services/programadores';
import { ProyectosService, Proyecto } from '../../../services/proyectos';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  templateUrl: './portafolio.html',
  styleUrls: ['./portafolio.scss'],
  imports: [CommonModule, RouterModule]
})
export class PortafolioComponent implements OnInit {

  idProgramador!: string;
  programador: Programador | null = null;

  proyectosAcademicos: Proyecto[] = [];
  proyectosLaborales: Proyecto[] = [];

  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private programadoresService: ProgramadoresService,
    private proyectosService: ProyectosService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;

    // 1. Cargar datos del programador
    this.programadoresService.getProgramador(this.idProgramador)
      .subscribe((p) => {
        this.programador = p;
      });

    // 2. Cargar proyectos de este programador
    this.proyectosService.getProyectos(this.idProgramador)
      .subscribe((proys) => {
        this.proyectosAcademicos = proys.filter(p => p.categoria === 'academico');
        this.proyectosLaborales = proys.filter(p => p.categoria === 'laboral');
        this.cargando = false;
      });
  }
}
