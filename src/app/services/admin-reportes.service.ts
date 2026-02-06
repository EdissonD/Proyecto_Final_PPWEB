import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type EstadoAsesoria = 'pendiente' | 'aprobada' | 'rechazada' | '';

export interface ReportesAsesoriasDashboardDTO {
  programadorId: string;
  nombre: string;
  pendiente: number;
  aprobada: number;
  rechazada: number;
  total: number;
}

export interface ReportesProyectosDashboardDTO {
  programadorId: string;
  nombre: string;
  activos: number;
  inactivos: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class AdminReportesService {
  private base = `${environment.apiUrl}/api/admin/reportes`;

  constructor(private http: HttpClient) {}

  // ---------------------------
  // DASHBOARD (JSON)
  // ---------------------------
  dashboardAsesorias(filters?: {
    from?: string; // yyyy-MM-dd
    to?: string;   // yyyy-MM-dd
    programadorId?: string;
    estado?: EstadoAsesoria;
  }): Observable<ReportesAsesoriasDashboardDTO[]> {
    let params = new HttpParams();
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.programadorId) params = params.set('programadorId', filters.programadorId);
    if (filters?.estado) params = params.set('estado', filters.estado);

    return this.http.get<ReportesAsesoriasDashboardDTO[]>(`${this.base}/asesorias`, { params });
  }

  dashboardProyectos(filters?: {
    from?: string; // ISO LocalDateTime o lo que tu backend espere (si cambias a LocalDate, mejor)
    to?: string;
    programadorId?: string;
    estado?: string;
  }): Observable<ReportesProyectosDashboardDTO[]> {
    let params = new HttpParams();
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    if (filters?.programadorId) params = params.set('programadorId', filters.programadorId);
    if (filters?.estado) params = params.set('estado', filters.estado);

    return this.http.get<ReportesProyectosDashboardDTO[]>(`${this.base}/proyectos`, { params });
  }

  // ---------------------------
  // EXPORT (BLOB)
  // ---------------------------
  exportAsesoriasXlsx(filters?: any): Observable<Blob> {
    return this.exportBlob(`${this.base}/asesorias/export/xlsx`, filters);
  }

  exportAsesoriasPdf(filters?: any): Observable<Blob> {
    return this.exportBlob(`${this.base}/asesorias/export/pdf`, filters);
  }

  exportProyectosXlsx(filters?: any): Observable<Blob> {
    return this.exportBlob(`${this.base}/proyectos/export/xlsx`, filters);
  }

  exportProyectosPdf(filters?: any): Observable<Blob> {
    return this.exportBlob(`${this.base}/proyectos/export/pdf`, filters);
  }

  private exportBlob(url: string, filters?: Record<string, any>): Observable<Blob> {
    let params = new HttpParams();
    if (filters) {
      for (const k of Object.keys(filters)) {
        const v = filters[k];
        if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v));
      }
    }
    return this.http.get(url, { params, responseType: 'blob' });
  }
}
