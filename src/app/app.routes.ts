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
import { CreacionEventosComponent } from './components/shared/creacion-eventos/creacion-eventos.component';

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
    path: "pagos",
    component: PagosComponent,
    canActivate: [loginGuard],
    //TODO METER EL GUARD
  },
  {
    path: "panel_administrador",
    component: PanelAdministradorComponent,
    canActivate: [adminGuard]
    //TODO METER EL GUARD
  },
  {
    path: "creacion_eventos",
    component: CreacionEventosComponent,
    canActivate: [adminGuard]
  },
  {
    path: "register",
    component: RegisterComponent
  },
  //Debemos dejar siempre el NotFound404 ultimo
  {path: '**', component: NotFoundComponent}
];
