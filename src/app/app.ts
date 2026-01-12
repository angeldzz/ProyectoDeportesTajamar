import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import {LoginComponent} from './components/pages/auth/login/login.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import {RegisterComponent} from './components/pages/auth/register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, NavbarComponent],
  providers: [HttpClient,AuthService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
}
