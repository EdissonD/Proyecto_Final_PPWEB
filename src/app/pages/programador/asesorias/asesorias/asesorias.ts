import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { ProgramadoresService, Programador } from '../../../../services/programadores';

@Component({
  selector: 'app-programador-asesorias',
  standalone: true,
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProgramadorAsesoriasComponent implements OnInit {

  idProgramador!: string;
  programador: Programador | null = null;

  asesorias: Asesoria[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private asesoriasService: AsesoriasService,
    private programadoresService: ProgramadoresService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('idProgramador')!;

    // cargar datos del programador
    this.programadoresService.getProgramador(this.idProgramador)
      .subscribe(p => this.programador = p);

    // cargar asesorías de este programador
    this.cargarAsesorias();
  }

  cargarAsesorias() {
    this.asesoriasService.getAsesoriasPorProgramador(this.idProgramador)
      .subscribe(lista => {
        this.asesorias = lista;
        this.cargando = false;
      });
  }

  async aprobar(asesoria: Asesoria) {
    const mensaje = prompt(
      'Mensaje para el solicitante (opcional):',
      'Tu asesoría ha sido aprobada. Nos vemos en la fecha y hora acordadas.'
    ) || 'Tu asesoría ha sido aprobada.';

    await this.asesoriasService.updateAsesoria(asesoria.id!, {
      estado: 'aprobada',
      respuestaProgramador: mensaje
    });

    alert('Asesoría aprobada');
    this.cargarAsesorias();
  }

  async rechazar(asesoria: Asesoria) {
    const mensaje = prompt(
      'Motivo del rechazo (opcional):',
      'En este momento no puedo atender la asesoría. Por favor vuelve a agendar en otro horario.'
    ) || 'La asesoría ha sido rechazada.';

    await this.asesoriasService.updateAsesoria(asesoria.id!, {
      estado: 'rechazada',
      respuestaProgramador: mensaje
    });

    alert('Asesoría rechazada');
    this.cargarAsesorias();
  }
}
