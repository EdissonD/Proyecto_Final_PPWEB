import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { AuthService } from '../../../../services/auth';
import { ProgramadoresService, Programador } from '../../../../services/programadores';

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  templateUrl: './mis-asesorias.html',
  styleUrls: ['./mis-asesorias.scss'],
  imports: [CommonModule, RouterModule]
})
export class MisAsesoriasComponent implements OnInit {

  asesorias: Asesoria[] = [];
  cargando = true;

  // para mostrar nombre del programador en la tabla
  mapProgramadores = new Map<string, Programador>();

  constructor(
    private asesoriasService: AsesoriasService,
    private authService: AuthService,
    private programadoresService: ProgramadoresService
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos el usuario logueado
    this.authService.usuario$.subscribe(usuario => {
      if (!usuario) {
        this.cargando = false;
        return;
      }

      // 2. Buscamos sus asesorías
      this.asesoriasService.getAsesoriasPorSolicitante(usuario.uid)
        .subscribe(async (lista) => {
          this.asesorias = lista;

          // 3. Traemos info básica de cada programador para mostrar su nombre
          const idsProgramadores = Array.from(new Set(lista.map(a => a.idProgramador)));

          for (const id of idsProgramadores) {
            // evitamos pedir dos veces el mismo
            if (this.mapProgramadores.has(id)) continue;

            this.programadoresService.getProgramador(id)
              .subscribe(p => {
                if (p) this.mapProgramadores.set(id, p);
              });
          }

          this.cargando = false;
        });
    });
  }

  nombreProgramador(idProgramador: string): string {
    const p = this.mapProgramadores.get(idProgramador);
    return p ? p.nombre : 'Programador';
  }
}
