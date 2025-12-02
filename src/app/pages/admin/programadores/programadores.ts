import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgramadoresService, Programador } from '../../../services/programadores';

@Component({
  selector: 'app-programadores',
  standalone: true,
  templateUrl: './programadores.html',
  styleUrls: ['./programadores.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProgramadoresComponent implements OnInit {

  lista: Programador[] = [];

  constructor(
    private programadoresService: ProgramadoresService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.cargarProgramadores();
  }
  cargarProgramadores() {
    this.programadoresService.getProgramadores()
      .subscribe({
        next: (programadores) => {
          this.ngZone.run(() => {
            console.log('🔥 Firebase devolvió:', programadores);
            this.lista = programadores;
          });
        },
        error: (err) => {
          console.error('🚨 ERROR FIRESTORE getProgramadores:', err);
        }
      });
  }

  async eliminar(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Seguro que quieres eliminar este programador?')) return;

    await this.programadoresService.deleteProgramador(id);
    alert('Programador eliminado');
    this.cargarProgramadores();
  }
}