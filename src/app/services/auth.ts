import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from '../core/auth/token.service';

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol?: 'admin' | 'programador' | 'usuario';
}

// ✅ Lo que tus páginas importan
export interface UsuarioApp {
  email?: string; // viene en sub
  nombre?: string;
  rol?: 'admin' | 'programador' | 'usuario';
  idProgramador?: string;
}

// decodificador simple (sin librerías)
function decodeJwtPayload(token: string): UsuarioApp | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const raw = JSON.parse(json);

    return {
      email: raw.sub,              // ✅ sub -> email
      nombre: raw.nombre,
      rol: raw.rol,
      idProgramador: raw.idProgramador,
    } as UsuarioApp;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;

  private _usuario = new BehaviorSubject<UsuarioApp | null>(null);
  usuario$ = this._usuario.asObservable();

  constructor(private http: HttpClient, private token: TokenService) {
    const t = this.token.get();
    if (t) this._usuario.next(decodeJwtPayload(t));
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, body).pipe(
      tap((res) => {
        this.token.set(res.token);
        this._usuario.next(decodeJwtPayload(res.token));
      })
    );
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, body).pipe(
      tap((res) => {
        this.token.set(res.token);
        this._usuario.next(decodeJwtPayload(res.token));
      })
    );
  }

  logout(): void {
    this.token.clear();
    this._usuario.next(null);
  }

  getToken(): string | null {
    return this.token.get();
  }

  isLoggedIn(): boolean {
    return this.token.isLoggedIn();
  }

  getRol(): string | null {
    return this._usuario.value?.rol ?? null;
  }

  getUsuarioActual(): UsuarioApp | null {
    return this._usuario.value;
  }
}
