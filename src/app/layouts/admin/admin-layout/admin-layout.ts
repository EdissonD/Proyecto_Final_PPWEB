import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../services/auth';
import { NotificacionComponent } from '../../../components/notificacion/notificacion';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss'],
  imports: [CommonModule, RouterModule, NotificacionComponent, ThemeToggleComponent]
})
export class AdminLayoutComponent {
  usuario$: Observable<any | null>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.usuario$ = this.auth.usuario$;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
