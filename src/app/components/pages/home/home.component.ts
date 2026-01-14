import {Component} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public eventos!: Array<Evento>

  constructor(private _authService: AuthService, private _serviceEventos: EventosService) { }

  ngOnInit(): void {
    this._serviceEventos.GetEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        console.log(data);
      }
    });
  }

  logout() {
    this._authService.logout();
  }

}
