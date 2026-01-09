import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component/navbar.component';
import {LoginComponent} from './pages/auth/login.component/login.component';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './core/services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavbarComponent,LoginComponent],
  providers: [HttpClient,AuthService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
}
