import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { InicioComponent } from './pages/inicio/inicio';
import { UsuariosComponent } from './pages/usuarios/usuarios';

import { AdminComponent } from './pages/admin/admin';
import { ProgramadorComponent } from './pages/programador/programador';

import { ProgramadorNuevoComponent } from './pages/admin/programadores/programador-nuevo';
import { EditarComponent } from './pages/admin/programadores/editar/editar';

import { ProyectosAdminComponent } from './pages/admin/programadores/proyectos/proyectos/proyectos';
import { ProyectoNuevoComponent } from './pages/admin/programadores/proyectos/proyecto-nuevo/proyecto-nuevo';
import { ProyectoEditarComponent } from './pages/admin/programadores/proyectos/proyecto-editar/proyecto-editar';

import { PortafolioComponent } from './pages/portafolio/portafolio/portafolio';

import { AgendarAsesoriaComponent } from './pages/asesorias/agendar/agendar/agendar';
import { ProgramadorAsesoriasComponent } from './pages/programador/asesorias/asesorias/asesorias';
import { MisAsesoriasComponent } from './pages/asesorias/mis-asesorias/mis-asesorias/mis-asesorias';

import { rolGuard } from './guards/rol.guard';

import { PublicLayoutComponent } from './layouts/public/public-layout/public-layout';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout';
import { ProgramadorLayoutComponent } from './layouts/programador/programador-layout/programador-layout';

// ✅ NUEVO: reportes admin
import { ReportesComponent } from './pages/admin/reportes/reportes.component';

export const routes: Routes = [
  // redirección inicial
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },

  // login fuera de layouts
  { path: 'login', component: LoginComponent },

  // ===========================
  // LAYOUT PÚBLICO
  // ===========================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'inicio', component: InicioComponent },

      // explorar programadores
      { path: 'usuarios', component: UsuariosComponent },

      // portafolio público
      { path: 'portafolio/:id', component: PortafolioComponent },

      // agendar asesoría (público)
      { path: 'asesoria/:idProgramador', component: AgendarAsesoriaComponent },

      // mis asesorías (requiere login)
      {
        path: 'mis-asesorias',
        component: MisAsesoriasComponent,
        canActivate: [rolGuard] // si no hay data.rol, solo valida autenticación
      }
    ]
  },

  // ===========================
  // LAYOUT ADMIN
  // ===========================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' },
    children: [
      { path: '', component: AdminComponent },

      // ✅ NUEVO: Reportes Administrativos
      { path: 'reportes', component: ReportesComponent },

      // programadores
      { path: 'programadores/nuevo', component: ProgramadorNuevoComponent },
      { path: 'programadores/editar/:id', component: EditarComponent },

      // proyectos admin por programador
      { path: 'programadores/:id/proyectos', component: ProyectosAdminComponent },
      { path: 'programadores/:id/proyectos/nuevo', component: ProyectoNuevoComponent },
      { path: 'programadores/:id/proyectos/editar/:idProyecto', component: ProyectoEditarComponent }
    ]
  },

  // ===========================
  // LAYOUT PROGRAMADOR
  // ===========================
  {
    path: 'programador',
    component: ProgramadorLayoutComponent,
    canActivate: [rolGuard],
    data: { rol: 'programador' },
    children: [
      { path: '', component: ProgramadorComponent },

      // alias
      { path: 'proyectos', component: ProgramadorComponent },

      // asesorías que recibe el programador
      { path: 'asesorias', component: ProgramadorAsesoriasComponent }
    ]
  },

  // wildcard
  { path: '**', redirectTo: 'inicio' }
];
