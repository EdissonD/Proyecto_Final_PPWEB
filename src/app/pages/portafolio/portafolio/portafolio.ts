import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

// Asegúrate de que tus interfaces estén bien importadas
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
    // Obtenemos el ID de la URL
    this.idProgramador = this.route.snapshot.paramMap.get('id')!;

    // 1. Cargar datos del programador
    this.programadoresService.getProgramador(this.idProgramador)
      .subscribe((p) => {
        this.programador = p;
      });

    // 2. Cargar proyectos
    this.proyectosService.getProyectos(this.idProgramador)
      .subscribe((proys) => {
        // CORRECCIÓN IMPORTANTE:
        // En el componente de editar usamos 'tipoProyecto', no 'categoria'.
        // Si no hacemos este cambio, las listas saldrán vacías.

        if (proys) {
          this.proyectosAcademicos = proys.filter(p => p.tipoProyecto === 'academico');
          this.proyectosLaborales = proys.filter(p => p.tipoProyecto === 'laboral');
        }

        this.cargando = false;
      });
  }
}