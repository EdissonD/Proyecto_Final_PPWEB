import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { AuthService, UsuarioApp } from '../../../../services/auth';

@Component({
  selector: 'app-programador-asesorias',
  standalone: true,
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
  imports: [CommonModule, RouterModule]
})
export class ProgramadorAsesoriasComponent implements OnInit {

  asesorias: Asesoria[] = [];
  cargando = true;
  usuarioActual: UsuarioApp | null = null;

  constructor(
    private asesoriasService: AsesoriasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.usuario$.subscribe({
      next: usuario => {
        console.log('USUARIO PROGRAMADOR:', usuario);
        this.usuarioActual = usuario;

        if (!usuario) {
          this.asesorias = [];
          this.cargando = false;
          return;
        }

        const idProgramador = usuario.idProgramador || usuario.uid;
        console.log('idProgramador usado para buscar asesorías:', idProgramador);

        this.asesoriasService.getAsesoriasPorProgramador(idProgramador)
          .subscribe({
            next: lista => {
              console.log('Asesorías encontradas para programador:', lista);
              this.asesorias = lista.sort((a, b) =>
                (b.creadoEn || '').localeCompare(a.creadoEn || '')
              );
            },
            error: err => {
              console.error('Error al cargar asesorías del programador:', err);
            },
            complete: () => {
              this.cargando = false;
            }
          });
      },
      error: err => {
        console.error('Error en usuario$ en ProgramadorAsesorias:', err);
        this.cargando = false;
      }
    });
  }

  get pendientesCount(): number {
    return this.asesorias.filter(a => a.estado === 'pendiente').length;
  }

  async cambiarEstado(a: Asesoria, nuevoEstado: 'aprobada' | 'rechazada') {
    if (!a.id) return;

    const textoAccion = nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar';
    const confirmar = confirm(`¿Seguro que deseas ${textoAccion} esta asesoría?`);
    if (!confirmar) return;

    const mensaje = prompt(
      'Mensaje para el solicitante (puede quedar vacío):',
      a.respuestaProgramador || ''
    );

    const cambios: Partial<Asesoria> = {
      estado: nuevoEstado
    };

    if (mensaje !== null) {
      cambios.respuestaProgramador = mensaje;
    }

    try {
      await this.asesoriasService.updateAsesoria(a.id, cambios);

      a.estado = nuevoEstado;
      if (mensaje !== null) {
        a.respuestaProgramador = mensaje;
      }

      this.simularEnvioExterno(a);

      alert(`Asesoría ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al actualizar la asesoría');
    }
  }

  etiquetaEstado(estado: Asesoria['estado']): string {
    if (estado === 'pendiente') return 'Pendiente';
    if (estado === 'aprobada') return 'Aprobada';
    if (estado === 'rechazada') return 'Rechazada';
    return estado;
  }

  simularEnvioExterno(a: Asesoria) {
    const asunto = `Respuesta a tu solicitud de asesoría (${this.etiquetaEstado(a.estado)})`;
    const cuerpo =
      `Para: ${a.emailSolicitante}
Asunto: ${asunto}

Hola ${a.nombreSolicitante},

Tu solicitud de asesoría para el día ${a.fecha} a las ${a.hora} ha sido ${this.etiquetaEstado(a.estado).toLowerCase()}.

Mensaje del programador:
${a.respuestaProgramador || '(sin mensaje adicional)'}

*Este es un envío simulado (no se envió realmente ningún correo).*`;

    alert(cuerpo);
  }
}
