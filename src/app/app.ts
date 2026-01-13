import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './components/pages/auth/login/login.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import {RegisterComponent} from './components/pages/auth/register/register.component';
import {LoginInterceptor} from './core/interceptors/login.interceptor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent,NavbarComponent],
  providers: [HttpClient,AuthService,LoginInterceptor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
}
