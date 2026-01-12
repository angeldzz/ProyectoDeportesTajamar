import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/auth/login/login.component';
import { RegisterComponent } from './components/pages/auth/register/register.component';
import { PanelAdministradorComponent } from './components/pages/panel-administrador/panel-administrador.component';
import { PagosComponent } from './components/pages/pagos/pagos.component';
import { PerfilComponent } from './components/pages/perfil/perfil.component';
import { SeleccionDeportesComponent } from './components/pages/seleccion-deportes/seleccion-deportes.component';
import { SeleccionEquipoComponent } from './components/pages/seleccion-equipo/seleccion-equipo.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';

export const routes: Routes = [
    {path:"", component: HomeComponent},
    {path:"login", component: LoginComponent},
    {path:"register", component: RegisterComponent},
    {path:"perfil", component: PerfilComponent},
    {path:"panel_administrador", component: PanelAdministradorComponent},
    {path:"pagos", component: PagosComponent},
    {path:"seleccion_deportes", component: SeleccionDeportesComponent},
    {path:"seleccion_equipo", component: SeleccionEquipoComponent},
    //Debemos dejar siempre el NotFound404 ultimo
    {path: '**', component: NotFoundComponent}
];
