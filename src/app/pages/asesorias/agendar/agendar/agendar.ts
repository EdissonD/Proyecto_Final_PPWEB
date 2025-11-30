import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AsesoriasService, Asesoria } from '../../../../services/asesorias';
import { ProgramadoresService, Programador } from '../../../../services/programadores';
import { AuthService } from '../../../../services/auth';
import { firstValueFrom } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private asesoriasService: AsesoriasService,
    private programadoresService: ProgramadoresService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.idProgramador = this.route.snapshot.paramMap.get('idProgramador')!;

    // Formulario para el usuario normal
    this.form = this.fb.group({
      nombreSolicitante: ['', Validators.required],
      emailSolicitante: ['', [Validators.required, Validators.email]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      comentario: ['']
    });

    // Cargar datos del programador (solo para mostrar su nombre/foto)
    this.programadoresService.getProgramador(this.idProgramador)
      .subscribe(p => this.programador = p);

    // Si el usuario está logueado, rellenamos su nombre/email
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.form.patchValue({
          nombreSolicitante: usuario.nombre,
          emailSolicitante: usuario.email
        });
      }
    });
  }

  async enviarSolicitud() {
    if (this.form.invalid) return;

    this.cargando = true;

    const formValue = this.form.value;

    const usuario = await firstValueFrom(this.authService.usuario$);

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

    // solo si hay usuario logueado agregamos idSolicitante
    if (usuario) {
      data.idSolicitante = usuario.uid;
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