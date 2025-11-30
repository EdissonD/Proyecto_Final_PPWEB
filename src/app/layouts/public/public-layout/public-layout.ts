import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.scss'],
  imports: [RouterModule]
})
export class PublicLayoutComponent {}
