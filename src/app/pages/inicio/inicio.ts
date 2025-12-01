import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// AJUSTA la ruta al menú según donde lo tengas
import { MenuComponent } from '../../components/menu/menu';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MenuComponent      // 👈 IMPORTANTE
  ]
})
export class InicioComponent {}
