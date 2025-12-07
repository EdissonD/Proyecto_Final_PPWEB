import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { AuthService, UsuarioApp } from '../../../../services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-programador-asesorias',
  standalone: true,
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
  imports: [CommonModule]
})
export class ProgramadorAsesoriasComponent implements OnInit {

  usuario$!: Observable<UsuarioApp | null>;
  asesorias: Asesoria[] = [];
  cargando = true;
  error: string | null = null;

  // para mostrar la “notificación simulada”
  mensajeSimulado: string | null = null;

  constructor(
    private asesoriasService: AsesoriasService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario$ = this.auth.usuario$;

    this.auth.usuario$.subscribe(usuario => {
      if (!usuario || !usuario.idProgramador) {
        this.cargando = false;
        this.asesorias = [];
        return;
      }

      this.asesoriasService.getAsesoriasPorProgramador(usuario.idProgramador)
        .subscribe({
          next: (lista) => {
            this.asesorias = lista;
            this.cargando = false;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Ocurrió un error al cargar las asesorías.';
            this.cargando = false;
          }
        });
    });
  }

  cambiarEstado(asesoria: Asesoria, nuevoEstado: 'aprobada' | 'rechazada') {
    const nombre = asesoria.nombreSolicitante;
    const fechaHora = `${asesoria.fecha} ${asesoria.hora}`;

    const textoBase =
      nuevoEstado === 'aprobada'
        ? `Hola ${nombre}, tu solicitud de asesoría para el ${fechaHora} ha sido APROBADA. 
El programador te espera en el horario acordado.`
        : `Hola ${nombre}, lamentablemente tu solicitud de asesoría para el ${fechaHora} ha sido RECHAZADA. 
Motivo: (aquí el programador puede añadir una breve justificación).`;

    const cambios: Partial<Asesoria> = {
      estado: nuevoEstado,
      respuestaProgramador: textoBase
    };

    if (!asesoria.id) {
      console.error('La asesoría no tiene id');
      return;
    }

    this.asesoriasService.updateAsesoria(asesoria.id, cambios)
      .then(() => {
        // actualizar en memoria
        asesoria.estado = nuevoEstado;
        asesoria.respuestaProgramador = textoBase;

        // construir la “notificación simulada”
        this.mensajeSimulado =
          `Simulación de notificación por correo / WhatsApp

Para: ${asesoria.emailSolicitante}
Mensaje:
${textoBase}`;
      })
      .catch(err => {
        console.error(err);
        alert('Error al actualizar la asesoría');
      });
  }

  cerrarMensajeSimulado() {
    this.mensajeSimulado = null;
  }
}
