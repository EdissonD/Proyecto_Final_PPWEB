import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { AuthService, UsuarioApp } from '../../../../services/auth';

@Component({
  selector: 'app-programador-asesorias',
  standalone: true,
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
  imports: [CommonModule]
  // Nota: Se eliminó RouterModule. Si tu HTML tiene botones con [routerLink], agrégalo de nuevo aquí.
})
export class ProgramadorAsesoriasComponent implements OnInit {

  cargando = true;
  asesorias: Asesoria[] = [];
  usuario: UsuarioApp | null = null;

  constructor(
    private asesoriasService: AsesoriasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;

      // Si no hay usuario o no tiene idProgramador explícito, no cargamos datos
      if (!usuario || !usuario.idProgramador) {
        this.cargando = false;
        this.asesorias = [];
        return;
      }

      // Traemos las asesorías donde idProgramador coincide
      this.asesoriasService.getAsesoriasPorProgramador(usuario.idProgramador)
        .subscribe(lista => {
          // Ordenar por fecha de creación (más recientes primero)
          // Se usa (|| '') para evitar errores si algún registro antiguo no tiene fecha
          this.asesorias = lista.sort((a, b) =>
            (b.creadoEn || '').localeCompare(a.creadoEn || '')
          );
          this.cargando = false;
        });
    });
  }

  // --------- ACCIONES DEL PROGRAMADOR ---------

  aprobar(a: Asesoria) {
    const mensaje = prompt(
      'Mensaje para el estudiante (se mostrará en su panel):',
      'Tu asesoría ha sido aprobada. Nos vemos en la fecha y hora acordada.'
    );

    // Si el usuario cancela el prompt, mensaje es null
    if (mensaje === null) return;

    this.cambiarEstado(a, 'aprobada', mensaje);
  }

  rechazar(a: Asesoria) {
    const mensaje = prompt(
      'Motivo del rechazo (se mostrará en su panel):',
      'Por favor vuelve a proponer otra fecha u horario.'
    );

    if (mensaje === null) return;

    this.cambiarEstado(a, 'rechazada', mensaje);
  }

  private async cambiarEstado(a: Asesoria, estado: 'aprobada' | 'rechazada', mensaje: string) {
    if (!a.id) return;

    try {
      await this.asesoriasService.updateAsesoria(a.id, {
        estado,
        respuestaProgramador: mensaje
      });

      // Actualizar en memoria para que el cambio se refleje en la UI al instante
      a.estado = estado;
      a.respuestaProgramador = mensaje;

      // 🔔 Simulación de notificación externa (correo / whatsapp)
      alert(
        `SIMULACIÓN DE NOTIFICACIÓN\n\n` +
        `Se enviaría un correo a: ${a.emailSolicitante}\n\n` +
        `Asunto: Respuesta a tu solicitud de asesoría\n` +
        `Mensaje: ${mensaje}`
      );
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la asesoría');
    }
  }
}