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

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [loginGuard],
  },

  {
    path: "perfil",
    component: PerfilComponent
  },

  {
    path: "seleccion_deportes",
    component: SeleccionDeportesComponent
    //TODO METER EL GUARD
  },
  {
    path: "seleccion_equipo",
    component: SeleccionEquipoComponent
    //TODO METER EL GUARD
  },
  {
    path: "panel_administrador",
    component: PanelAdministradorComponent
    //TODO METER EL GUARD
  },
  {
    path: "pagos",
    component: PagosComponent,
    //TODO METER EL GUARD
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },

  //Debemos dejar siempre el NotFound404 ultimo
  {path: '**', component: NotFoundComponent}
];
