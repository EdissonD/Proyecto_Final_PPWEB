import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportesApiService {
  private base = `${environment.apiUrl}/api/programador/reportes`;

  constructor(private http: HttpClient) {}

  pdf(): Observable<Blob> {
    return this.http.get(`${this.base}/pdf`, { responseType: 'blob' });
  }

  excel(): Observable<Blob> {
    return this.http.get(`${this.base}/excel`, { responseType: 'blob' });
  }
}
