import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Proyecto {
  id: string;              // ✅ ya no opcional (para editar/eliminar sin casts)
  idProgramador?: string;  // (si tu backend lo envía / usa)
  titulo: string;
  descripcion: string;
  tecnologias: string;
  urlRepo?: string;
  urlDemo?: string;
  estado?: string;
  creadoEn?: string;
}

@Injectable({ providedIn: 'root' })
export class ProyectosService {
  private base = `${environment.apiUrl}/api/proyectos`;

  constructor(private http: HttpClient) {}

  // ======================
  // API "original" (obtener*)
  // ======================

  obtenerTodos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.base);
  }

  obtenerUno(id: string): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.base}/${id}`);
  }

  obtenerPorProgramador(idProgramador: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.base}/programador/${idProgramador}`);
  }

  crearProyecto(body: Omit<Proyecto, 'id'>): Observable<any> {
    return this.http.post<any>(this.base, body);
  }

  actualizarProyecto(id: string, body: Partial<Proyecto>): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, body);
  }

  eliminarProyecto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }

  // ======================
  // ALIAS (para tus componentes viejos)
  // ======================

  // lo que en tus componentes estabas llamando: getProyectosDeProgramador(...)
  getProyectosDeProgramador(idProgramador: string): Observable<Proyecto[]> {
    return this.obtenerPorProgramador(idProgramador);
  }

  // lo que estabas llamando: getProyecto(...)
  getProyecto(id: string): Observable<Proyecto> {
    return this.obtenerUno(id);
  }
}
