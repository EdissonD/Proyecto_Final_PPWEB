import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ProgramadorPublicoDTO {
  id: string;
  nombre: string;
  foto?: string | null;
  especialidad?: string | null;
  descripcion?: string | null;
  disponibilidad?: string | null;
  horasDisponibles?: string[];
  usuarioId?: string;
}

export interface ProgramadorGuardarDTO {
  nombre: string;
  descripcion: string;
  especialidad: string;

  fotoUrl?: string | null;

  emailContacto?: string | null;
  github?: string | null;
  linkedin?: string | null;
  portafolio?: string | null;
  whatsapp?: string | null;

  disponibilidad?: string | null;
  horasDisponibles?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProgramadoresService {
  private base = `${environment.apiUrl}/api/programadores`;

  constructor(private http: HttpClient) {}

  // ✅ Público
  getProgramadores(): Observable<ProgramadorPublicoDTO[]> {
    return this.http.get<ProgramadorPublicoDTO[]>(this.base);
  }

  getProgramador(id: string): Observable<ProgramadorPublicoDTO> {
    return this.http.get<ProgramadorPublicoDTO>(`${this.base}/${id}`);
  }

  // ✅ Admin (JSON)
  crearProgramador(body: ProgramadorGuardarDTO): Observable<any> {
    return this.http.post(this.base, body);
  }

  updateProgramador(id: string, body: ProgramadorGuardarDTO): Observable<any> {
    return this.http.put(`${this.base}/${id}`, body);
  }

  deleteProgramador(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
