import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { AdminReportesService, ReportesAsesoriasDashboardDTO, ReportesProyectosDashboardDTO } from '../../../services/admin-reportes.service';
import { NotificacionesService } from '../../../services/notificaciones';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {

  form!: FormGroup;

  cargandoAsesorias = false;
  cargandoProyectos = false;

  asesorias: ReportesAsesoriasDashboardDTO[] = [];
  proyectos: ReportesProyectosDashboardDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private api: AdminReportesService,
    private noti: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      from: [''],          // yyyy-MM-dd
      to: [''],            // yyyy-MM-dd
      programadorId: [''], // UUID
      estadoAsesoria: [''],// pendiente/aprobada/rechazada
      estadoProyecto: [''] // opcional si lo usas
    });

    this.cargarTodo();
  }

  get filtrosAsesorias() {
    const v = this.form.value;
    return {
      from: v.from || undefined,
      to: v.to || undefined,
      programadorId: v.programadorId || undefined,
      estado: v.estadoAsesoria || undefined
    };
  }

  get filtrosProyectos() {
    const v = this.form.value;
    // OJO: tu backend para proyectos usa LocalDateTime.
    // Por ahora NO enviamos from/to a proyectos salvo que cambies backend a LocalDate.
    return {
      programadorId: v.programadorId || undefined,
      estado: v.estadoProyecto || undefined
    };
  }

  cargarTodo() {
    this.cargarAsesorias();
    this.cargarProyectos();
  }

  cargarAsesorias() {
    this.cargandoAsesorias = true;
    this.api.dashboardAsesorias(this.filtrosAsesorias).subscribe({
      next: (rows) => this.asesorias = rows || [],
      error: (e) => {
        console.error(e);
        this.noti.error('No se pudo cargar el dashboard de asesorías');
      },
      complete: () => this.cargandoAsesorias = false
    });
  }

  cargarProyectos() {
    this.cargandoProyectos = true;
    this.api.dashboardProyectos(this.filtrosProyectos).subscribe({
      next: (rows) => this.proyectos = rows || [],
      error: (e) => {
        console.error(e);
        this.noti.error('No se pudo cargar el dashboard de proyectos');
      },
      complete: () => this.cargandoProyectos = false
    });
  }

  // -----------------------
  // DESCARGAS
  // -----------------------
  descargarAsesoriasXlsx() {
    this.api.exportAsesoriasXlsx(this.filtrosAsesorias).subscribe({
      next: (blob) => this.saveBlob(blob, 'reporte_asesorias.xlsx'),
      error: (e) => { console.error(e); this.noti.error('No se pudo descargar XLSX de asesorías'); }
    });
  }

  descargarAsesoriasPdf() {
    this.api.exportAsesoriasPdf(this.filtrosAsesorias).subscribe({
      next: (blob) => this.saveBlob(blob, 'reporte_asesorias.pdf'),
      error: (e) => { console.error(e); this.noti.error('No se pudo descargar PDF de asesorías'); }
    });
  }

  descargarProyectosXlsx() {
    this.api.exportProyectosXlsx(this.filtrosProyectos).subscribe({
      next: (blob) => this.saveBlob(blob, 'reporte_proyectos.xlsx'),
      error: (e) => { console.error(e); this.noti.error('No se pudo descargar XLSX de proyectos'); }
    });
  }

  descargarProyectosPdf() {
    this.api.exportProyectosPdf(this.filtrosProyectos).subscribe({
      next: (blob) => this.saveBlob(blob, 'reporte_proyectos.pdf'),
      error: (e) => { console.error(e); this.noti.error('No se pudo descargar PDF de proyectos'); }
    });
  }

  private saveBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  trackByProg(_: number, r: any) { return r?.programadorId; }
}
