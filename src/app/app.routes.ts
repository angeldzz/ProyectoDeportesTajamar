import {Routes} from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {LoginComponent} from './components/pages/auth/login/login.component';
import {RegisterComponent} from './components/pages/auth/register/register.component';
import {PanelAdministradorComponent} from './components/pages/panel-administrador/panel-administrador.component';
import {PagosComponent} from './components/pages/pagos/pagos.component';
import {PerfilComponent} from './components/pages/perfil/perfil.component';
import {SeleccionDeportesComponent} from './components/pages/seleccion-deportes/seleccion-deportes.component';
import {SeleccionEquipoComponent} from './components/pages/seleccion-equipo/seleccion-equipo.component';
import {ClasesAlumnosComponent} from './components/pages/clases-alumnos/clases-alumnos.component';
import {MaterialesComponent} from './components/pages/materiales/materiales.component';
import {NotFoundComponent} from './components/pages/not-found/not-found.component';
import {authGuard} from './core/guards/auth.guard';
import {loginGuard} from './core/guards/login.guard';
import {adminGuard} from './core/guards/admin.guard';
import {CreacionEventosComponent} from './components/shared/creacion-eventos/creacion-eventos.component';
import {DeporteEventoComponent} from './components/pages/deporte-evento/deporte-evento.component';
import {ColoresComponent} from './components/pages/forms/colores-form/colores.component';
import {DeportesFormComponent} from './components/pages/forms/deportes-form/deportes-form.component';
import {ResultadosComponent} from './components/pages/resultados/resultados.component';
import { AsignacionActividadEventoComponent } from './components/shared/asignacion-actividad-evento.component/asignacion-actividad-evento.component';
import {capitanGuard} from './core/guards/capitan.guard';
import {OrganizadoresComponent} from './components/pages/forms/organizadores/organizadores.component';
import {organizadorGuard} from './core/guards/organizador.guard';
import {EventosFormComponent} from './components/pages/forms/eventos-form/eventos-form.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [loginGuard],
  },
  {
    path: "perfil",
    component: PerfilComponent,
    canActivate: [loginGuard],
  },

  {
    path: "seleccion_deportes/:idEvento",
    component: SeleccionDeportesComponent,
    canActivate: [loginGuard],

  },
  {
    path: "seleccion_equipo",
    component: SeleccionEquipoComponent,
    canActivate: [loginGuard],

  },
  {
    path: "resultados",
    component: ResultadosComponent,
    canActivate: [loginGuard],
  },
  {
    path: "pagos",
    component: PagosComponent,
    canActivate: [loginGuard],
  },
  {
    path: "clases-alumnos",
    component: ClasesAlumnosComponent
  },
  // {
  //   path: "materiales",
  //   component: MaterialesComponent
  // },
  {
    path: "deporte_eventos/:idEvento/:idDeporte",
    component: DeporteEventoComponent,
    canActivate: [loginGuard],
  },{
    path: "seleccionar-equipo/:idEvento/:idActividad",
    component: SeleccionEquipoComponent,
    canActivate: [loginGuard],
  },
  {
    path: "creacion_eventos",
    component: CreacionEventosComponent,
    canActivate: [organizadorGuard]
  },
  {
    path: "asignacion-actividad-evento/:idEvento",
    component: AsignacionActividadEventoComponent,
    canActivate: [organizadorGuard]
  },
  {
    path: "materiales/:idEvento/:idActividad",
    component: MaterialesComponent,
    canActivate: [organizadorGuard]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {

    //TODO CONTROLAR ADMIN Y ORGANIZADOR
    path: "panel_administrador",
    component: PanelAdministradorComponent,
    canActivate: [organizadorGuard],
    children:
      [
        {path: 'colores-form', component: ColoresComponent},
        {path: 'actividades-form', component: DeportesFormComponent},
        {path: 'eventos-form', component: EventosFormComponent},
        {path: 'organizadores-form', component: OrganizadoresComponent,canActivate: [adminGuard]},
      ]

  },
  {path: '**', component: NotFoundComponent}
];
