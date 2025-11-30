import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { InicioComponent } from './pages/inicio/inicio';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { AdminComponent } from './pages/admin/admin';
import { ProgramadorComponent } from './pages/programador/programador';

import { ProgramadoresComponent } from './pages/admin/programadores/programadores';
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

export const routes: Routes = [
  // redirección inicial
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // públicas básicas
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },

  // vista pública para explorar programadores (usuario externo)
  {
    path: 'usuarios',
    component: UsuariosComponent
    // sin guard: cualquier usuario puede explorar portafolios
  },

  // portafolio público de un programador
  {
    path: 'portafolio/:id',
    component: PortafolioComponent
  },

  // agendar asesoría con un programador específico
  {
    path: 'asesoria/:idProgramador',
    component: AgendarAsesoriaComponent
  },

  // PANEL ADMIN → solo ADMIN
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores',
    component: ProgramadoresComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores/nuevo',
    component: ProgramadorNuevoComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores/editar/:id',
    component: EditarComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores/:id/proyectos',
    component: ProyectosAdminComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores/:id/proyectos/nuevo',
    component: ProyectoNuevoComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },
  {
    path: 'admin/programadores/:id/proyectos/editar/:idProyecto',
    component: ProyectoEditarComponent,
    canActivate: [rolGuard],
    data: { rol: 'admin' }
  },

  // PANEL PROGRAMADOR → solo PROGRAMADOR
  {
    path: 'programador',
    component: ProgramadorComponent,
    canActivate: [rolGuard],
    data: { rol: 'programador' }
  },
  {
    path: 'programador/asesorias/:idProgramador',
    component: ProgramadorAsesoriasComponent,
    canActivate: [rolGuard],
    data: { rol: 'programador' }
  },

  // Mis asesorías → cualquier usuario logueado (sin rol específico)
  {
    path: 'mis-asesorias',
    component: MisAsesoriasComponent,
    canActivate: [rolGuard]
  },

  // wildcard opcional por si alguien se va a ruta rara
  { path: '**', redirectTo: 'inicio' }
];
