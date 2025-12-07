// src/app/components/theme-toggle/theme-toggle.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button class="btn btn-ghost theme-toggle" (click)="toggle()">
      <ng-container *ngIf="theme === 'dark'; else lightTpl">
        🌙 <span>Oscuro</span>
      </ng-container>
      <ng-template #lightTpl>
        ☀️ <span>Claro</span>
      </ng-template>
    </button>
  `,
    styleUrls: ['./theme-toggle.scss']
})
export class ThemeToggleComponent {

    theme: 'light' | 'dark' = 'dark';

    constructor(private themeService: ThemeService) {
        this.themeService.theme$.subscribe(t => this.theme = t);
    }

    toggle() {
        this.themeService.toggleTheme();
    }
}
