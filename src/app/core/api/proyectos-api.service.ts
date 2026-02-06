import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Proyecto {
  id?: string;
  titulo: string;
  descripcion: string;
  tecnologias: string;
  urlRepo?: string;
  urlDemo?: string;
  estado?: string;
  creadoEn?: string;
}

@Injectable({ providedIn: 'root' })
export class ProyectosApiService {
  private base = `${environment.apiUrl}/api/proyectos`;

  constructor(private http: HttpClient) {}

  // Públicos
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getOne(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  getPorProgramador(idProgramador: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/programador/${idProgramador}`);
  }

  // Privados (requieren JWT)
  crear(body: Proyecto): Observable<any> {
    return this.http.post<any>(this.base, body);
  }

  actualizar(id: string, body: Proyecto): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
}
