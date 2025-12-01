import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { ProgramadoresService, Programador } from '../../../../services/programadores';
import { AuthService, UsuarioApp } from '../../../../services/auth';

@Component({
  selector: 'app-agendar-asesoria',
  standalone: true,
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AgendarAsesoriaComponent implements OnInit {

  form!: FormGroup;
  idProgramador!: string;
  programador: Programador | null = null;
  cargando = false;

  // 👉 Propiedad para guardar las horas traídas del programador
  horasDisponibles: string[] = [];

  // guardamos aquí el usuario logueado
  usuarioActual: UsuarioApp | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asesoriasService: AsesoriasService,
    private programadoresService: ProgramadoresService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // id del programador desde la URL
    this.idProgramador = this.route.snapshot.paramMap.get('idProgramador')!;

    // Formulario para solicitar la asesoría
    this.form = this.fb.group({
      nombreSolicitante: ['', Validators.required],
      emailSolicitante: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      comentario: ['']
    });

    // Cargar datos del programador y sus horas disponibles
    this.programadoresService.getProgramador(this.idProgramador)
      .subscribe((p: Programador | undefined) => { // Ajuste de tipo por seguridad
        this.programador = p || null;
        // Lógica agregada:
        this.horasDisponibles = p?.horasDisponibles || [];
      });

    // Nos suscribimos una vez y guardamos el usuario
    this.authService.usuario$.subscribe(usuario => {
      console.log('USUARIO EN SUBSCRIBE:', usuario);
      this.usuarioActual = usuario;

      if (usuario) {
        this.form.patchValue({
          nombreSolicitante: usuario.nombre,
          emailSolicitante: usuario.email
        });
      }
    });
  }

  async enviarSolicitud() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const formValue = this.form.value;
    console.log('USUARIO AL ENVIAR:', this.usuarioActual);

    const data: Asesoria = {
      idProgramador: this.idProgramador,
      nombreSolicitante: formValue.nombreSolicitante,
      emailSolicitante: formValue.emailSolicitante,
      fecha: formValue.fecha,
      hora: formValue.hora,
      comentario: formValue.comentario,
      estado: 'pendiente',
      creadoEn: new Date().toISOString()
    };

    // Si hay usuario logueado, guardamos su ID
    if (this.usuarioActual) {
      data.idSolicitante = this.usuarioActual.uid;
    }

    try {
      await this.asesoriasService.crearAsesoria(data);
      alert('Solicitud de asesoría enviada. El programador la revisará en su panel.');
      this.router.navigate(['/portafolio', this.idProgramador]);
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al enviar la solicitud');
    } finally {
      this.cargando = false;
    }
  }
}