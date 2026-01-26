import {Routes} from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {LoginComponent} from './components/pages/auth/login/login.component';
import {RegisterComponent} from './components/pages/auth/register/register.component';
import {PanelAdministradorComponent} from './components/pages/panel-administrador/panel-administrador.component';
import {PagosComponent} from './components/pages/pagos/pagos.component';
import {PerfilComponent} from './components/pages/perfil/perfil.component';
import {SeleccionDeportesComponent} from './components/pages/seleccion-deportes/seleccion-deportes.component';
import {SeleccionEquipoComponent} from './components/pages/seleccion-equipo/seleccion-equipo.component';
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
    //TODO METER EL GUARD
  },
  {
    path: "seleccion_equipo",
    component: SeleccionEquipoComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },
  {
    path: "resultados",
    component: ResultadosComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },
  {
    path: "pagos",
    component: PagosComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },
  {
    path: "deporte_eventos/:idEvento/:idDeporte",
    component: DeporteEventoComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },{
    path: "seleccionar-equipo/:idEvento/:idActividad",
    component: SeleccionEquipoComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },
  {
    path: "creacion_eventos",
    component: CreacionEventosComponent,
    canActivate: [adminGuard]
  },
  {
    path: "asignacion-actividad-evento/:idEvento",
    component: AsignacionActividadEventoComponent,
    canActivate: [adminGuard]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "panel_administrador",
    component: PanelAdministradorComponent,
    canActivate: [adminGuard],
    children:
      [
        {path: 'colores-form', component: ColoresComponent},
        {path: 'actividades-form', component: DeportesFormComponent},
        //TODO QUITAR ESTA RUTA SELCCIONAR
        {path: 'seleccionar-equipo', component: SeleccionEquipoComponent},
      ]

  },
  {path: '**', component: NotFoundComponent}
];
