import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './components/pages/auth/login/login.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services/auth.service';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent,NavbarComponent],
  providers: [HttpClient,AuthService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
}
