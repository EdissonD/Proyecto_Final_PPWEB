import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface AsesoriaCreatePublica {
  idProgramador: string;
  nombreSolicitante: string;
  emailSolicitante: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  comentario?: string;
}

export interface Asesoria {
  id: string;
  nombreSolicitante: string;
  emailSolicitante: string;
  fecha: string;
  hora: string;
  comentario?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  respuestaProgramador?: string;
  creadoEn?: string;
}

@Injectable({ providedIn: 'root' })
export class AsesoriasApiService {
  private base = `${environment.apiUrl}/api/asesorias`;

  constructor(private http: HttpClient) {}

  // Público
  crearPublica(body: AsesoriaCreatePublica): Observable<any> {
    return this.http.post<any>(`${this.base}/publica`, body);
  }

  // Público (bloquear horas)
  ocupadas(idProgramador: string, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/ocupadas/${idProgramador}/${fecha}`);
  }

  // Privado - Usuario logueado
  mis(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/mis`);
  }

  // Privado - Programador logueado
  delProgramador(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/programador`);
  }

  // Privado - Programador actualiza (aprobar/rechazar)
  actualizar(id: string, body: { estado?: string; respuestaProgramador?: string }): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }

  // Privado - filtros programador
  filtradas(params: { estado?: string; desde?: string; hasta?: string }): Observable<any[]> {
    let httpParams = new HttpParams();
    if (params.estado) httpParams = httpParams.set('estado', params.estado);
    if (params.desde) httpParams = httpParams.set('desde', params.desde);
    if (params.hasta) httpParams = httpParams.set('hasta', params.hasta);

    return this.http.get<any[]>(`${this.base}/programador/filtradas`, { params: httpParams });
  }
}
