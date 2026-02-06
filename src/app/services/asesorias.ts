import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

// ✅ Lo que tus pages importan
export interface Asesoria {
  id?: string;

  fecha: string; // backend devuelve LocalDate como string
  hora: string;  // backend devuelve LocalTime como string
  estado: 'pendiente' | 'aprobada' | 'rechazada' | string;

  comentario?: string;
  respuestaProgramador?: string;

  nombreSolicitante?: string;
  emailSolicitante?: string;

  // el backend puede devolver objetos
  programador?: any;
  usuario?: any;
}

export interface AsesoriaCreatePublica {
  idProgramador: string;
  nombreSolicitante: string;
  emailSolicitante: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // HH:mm
  comentario?: string;
}

@Injectable({ providedIn: 'root' })
export class AsesoriasService {
  private base = `${environment.apiUrl}/api/asesorias`;

  constructor(private http: HttpClient) {}

  // ✅ público: crear asesoría
  crearPublica(body: AsesoriaCreatePublica): Observable<Asesoria> {
    return this.http.post<Asesoria>(`${this.base}/publica`, body);
  }

  // ✅ público: horas ocupadas
  getOcupadas(idProgramador: string, fecha: string): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(`${this.base}/ocupadas/${idProgramador}/${fecha}`);
  }

  // ✅ privado usuario: mis asesorías (JWT)
  misAsesorias(): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(`${this.base}/mis`);
  }

  // ✅ privado programador: asesorías del programador logueado (JWT)
  asesoriasProgramador(): Observable<Asesoria[]> {
    return this.http.get<Asesoria[]>(`${this.base}/programador`);
  }

  // ✅ privado: aprobar/rechazar + respuesta (JWT)
  actualizarAsesoria(
    id: string,
    body: { estado?: string; respuestaProgramador?: string }
  ): Observable<Asesoria> {
    return this.http.put<Asesoria>(`${this.base}/${id}`, body);
  }

  // ✅ privado: filtros
  filtradas(params: { estado?: string; desde?: string; hasta?: string }): Observable<Asesoria[]> {
    let httpParams = new HttpParams();
    if (params.estado) httpParams = httpParams.set('estado', params.estado);
    if (params.desde) httpParams = httpParams.set('desde', params.desde);
    if (params.hasta) httpParams = httpParams.set('hasta', params.hasta);

    return this.http.get<Asesoria[]>(`${this.base}/programador/filtradas`, { params: httpParams });
  }

  // =====================================================
  // ✅ COMPATIBILIDAD para componentes viejos (Firestore)
  // =====================================================

  // antes: getAsesoriasPorSolicitante(uid) => ahora /mis (JWT)
  getAsesoriasPorSolicitante(_idSolicitante: string): Observable<Asesoria[]> {
    return this.misAsesorias();
  }

  // antes: getAsesoriasPorProgramador(idProgramador) => ahora /programador (JWT)
  getAsesoriasPorProgramador(_idProgramador: string): Observable<Asesoria[]> {
    return this.asesoriasProgramador();
  }

  // antes: crearAsesoria(data) => ahora crearPublica(data)
  crearAsesoria(data: any): any {
    return this.crearPublica(data);
  }

    // antes: updateAsesoria(id, cambios)
    updateAsesoria(id: string, cambios: { estado?: string; respuestaProgramador?: string }): Observable<Asesoria> {
      return this.actualizarAsesoria(id, cambios);
    }
  }
