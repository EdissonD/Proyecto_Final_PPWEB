import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, ThemeToggleComponent],
})
export class LoginComponent {
  email = '';
  password = '';
  cargando = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  entrar(): void {
    if (!this.email || !this.password) {
      alert('Ingresa email y contraseña');
      return;
    }

    this.cargando = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const rol = this.auth.getRol();

        if (rol === 'admin') this.router.navigate(['/admin']);
        else if (rol === 'programador') this.router.navigate(['/programador']);
        else this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error(err);
        alert('Credenciales inválidas o error del servidor');
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      },
    });
  }
}
