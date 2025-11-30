import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programador-layout',
  standalone: true,
  templateUrl: './programador-layout.html',
  styleUrls: ['./programador-layout.scss'],
  imports: [RouterModule, CommonModule]
})
export class ProgramadorLayoutComponent {}
