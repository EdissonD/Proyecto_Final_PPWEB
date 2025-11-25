import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';

  constructor(private router: Router) { }

  iniciarSesion() {
    // Esto es solo “de prueba”. Luego podemos cambiarlo a lo que pida el PDF.
    if (this.usuario === 'admin' && this.contrasena === '1234') {
      this.router.navigate(['/inicio']);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
}
