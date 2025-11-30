import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProgramadoresService, Programador } from '../../services/programadores';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
  imports: [CommonModule, RouterModule]
})
export class UsuariosComponent implements OnInit {

  programadores: Programador[] = [];
  cargando = true;

  constructor(private programadoresService: ProgramadoresService) { }

  ngOnInit(): void {
    this.programadoresService.getProgramadores()
      .subscribe(lista => {
        this.programadores = lista;
        this.cargando = false;
      });
  }
}
