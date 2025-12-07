import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UsuarioApp } from '../../services/auth';
import { Observable } from 'rxjs'; // 1. Agregamos esta importación para tipar

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
  imports: [CommonModule, RouterModule]
})
export class InicioComponent {

  // 2. Solo declaramos la variable aquí (sin asignarle valor todavía)
  usuario$: Observable<UsuarioApp | null>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { 
    // 3. Asignamos el valor DENTRO del constructor
    // Aquí 'this.auth' ya existe y es seguro usarlo
    this.usuario$ = this.auth.usuario$;
  }

  irAPanel(usuario: UsuarioApp | null) {
    if (!usuario) {
      // visitante: lo mandamos a explorar programadores
      this.router.navigate(['/usuarios']);
      return;
    }

    switch (usuario.rol) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'programador':
        this.router.navigate(['/programador']);
        break;
      default:
        // usuario normal
        this.router.navigate(['/usuarios']);
        break;
    }
  }
}