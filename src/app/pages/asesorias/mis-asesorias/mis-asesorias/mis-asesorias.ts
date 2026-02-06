import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AsesoriasService } from '../../../../services/asesorias';
import { ProgramadoresService, ProgramadorPublicoDTO } from '../../../../services/programadores';

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  templateUrl: './mis-asesorias.html',
  styleUrls: ['./mis-asesorias.scss'],
  imports: [CommonModule, RouterModule]
})
export class MisAsesoriasComponent implements OnInit {

  asesorias: any[] = [];
  cargando = true;

  mapProgramadores = new Map<string, ProgramadorPublicoDTO>();

  constructor(
    private asesoriasService: AsesoriasService,
    private programadoresService: ProgramadoresService
  ) { }

  ngOnInit(): void {
    this.asesoriasService.misAsesorias().subscribe({
      next: (lista) => {
        this.asesorias = Array.isArray(lista) ? lista : [];

        const idsProgramadores = Array.from(new Set(
          this.asesorias
            .map(a => a?.programador?.id)
            .filter((x: any) => !!x)
        ));

        for (const id of idsProgramadores) {
          if (this.mapProgramadores.has(id)) continue;

          this.programadoresService.getProgramador(id).subscribe({
            next: (p) => { if (p) this.mapProgramadores.set(id, p); },
            error: () => { /* no rompe pantalla */ }
          });
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  idProgramadorDe(a: any): string {
    return a?.programador?.id || '';
  }

  nombreProgramador(programadorId: string): string {
    return this.mapProgramadores.get(programadorId)?.nombre ?? 'Programador';
  }

  trackByAsesoria(_: number, a: any) {
    return a?.id;
  }
}
