import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, UsuarioApp } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  imports: [CommonModule, RouterModule]
})
export class MenuComponent {

  usuario$: Observable<UsuarioApp | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario$ = this.authService.usuario$;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
