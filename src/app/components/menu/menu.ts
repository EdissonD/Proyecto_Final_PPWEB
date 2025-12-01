// src/app/components/menu/menu.ts (ejemplo)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  imports: [CommonModule, RouterModule]
})
export class MenuComponent {}
