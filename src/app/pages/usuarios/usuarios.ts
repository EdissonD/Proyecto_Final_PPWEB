import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProgramadoresService, ProgramadorPublicoDTO } from '../../services/programadores';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.scss'],
})
export class UsuariosComponent implements OnInit {

  programadores: ProgramadorPublicoDTO[] = [];
  cargando = true;

  esAdmin = false;

  constructor(
    private programadoresService: ProgramadoresService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.usuario$.subscribe(u => {
      this.esAdmin = (u?.rol === 'admin');
    });

    this.programadoresService.getProgramadores().subscribe({
      next: (lista: ProgramadorPublicoDTO[]) => {
        this.programadores = lista || [];
        this.cargando = false;
      },
      error: (e: unknown) => {
        console.error(e);
        this.programadores = [];
        this.cargando = false;
      }
    });
  }

  irNuevoProgramador() {
    this.router.navigate(['/admin/programadores/nuevo']);
  }

  trackByProgramador(_: number, p: ProgramadorPublicoDTO) {
    return p.id;
  }
}
