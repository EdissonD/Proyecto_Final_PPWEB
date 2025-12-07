import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {

    private _theme$ = new BehaviorSubject<Theme>('dark');
    readonly theme$ = this._theme$.asObservable();

    constructor() {
        // Cargar tema guardado o preferencia del sistema
        const saved = (localStorage.getItem(THEME_KEY) as Theme | null);

        if (saved === 'light' || saved === 'dark') {
            this.applyTheme(saved);
        } else {
            const prefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;

            this.applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    toggleTheme() {
        const next: Theme = this._theme$.value === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
    }

    private applyTheme(theme: Theme) {
        this._theme$.next(theme);
        localStorage.setItem(THEME_KEY, theme);

        const root = document.documentElement;
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    }

    get currentTheme(): Theme {
        return this._theme$.value;
    }
}
