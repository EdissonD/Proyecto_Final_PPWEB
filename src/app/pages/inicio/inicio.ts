import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class InicioComponent {}
