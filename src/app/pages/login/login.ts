import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule]
})
export class LoginComponent {

  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async loginGoogle() {
    this.cargando = true;

    try {
      // 1. Login con Google
      await this.authService.loginConGoogle();

      // 2. Obtenemos el usuario con rol UNA sola vez
      this.authService.usuario$
        .pipe(take(1))
        .subscribe(usuario => {
          if (!usuario) {
            this.cargando = false;
            return;
          }

          // 3. Redirigimos según rol
          if (usuario.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else if (usuario.rol === 'programador') {
            this.router.navigate(['/programador']);
          } else {
            this.router.navigate(['/inicio']);
          }

          this.cargando = false;
        });

    } catch (err) {
      console.error(err);
      alert('Error al iniciar sesión con Google');
      this.cargando = false;
    }
  }
}
