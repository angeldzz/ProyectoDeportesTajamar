import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import {LoginInterceptor} from './core/interceptors/login.interceptor';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  providers: [HttpClient,AuthService,LoginInterceptor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
  
  constructor(
    public authService: AuthService
  ){
  }
}

