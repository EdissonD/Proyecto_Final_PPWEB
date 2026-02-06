import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
  imports: [CommonModule, RouterModule]
})
export class InicioComponent {
  usuario$: Observable<any | null>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.usuario$ = this.auth.usuario$;
  }

  irAPanel(usuario: any | null) {
    if (!usuario) {
      this.router.navigate(['/usuarios']);
      return;
    }

    const rol = usuario.rol || 'usuario';

    if (rol === 'admin') this.router.navigate(['/admin']);
    else if (rol === 'programador') this.router.navigate(['/programador']);
    else this.router.navigate(['/usuarios']);
  }
}
