import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  public eventosanteriores!: Array<Evento>
  public eventosdisponibles!: Array<Evento>
  
  // Paginación eventos disponibles
  public paginaDisponibles: number = 1;
  public eventosPorPagina: number = 3;
  
  // Paginación eventos anteriores
  public paginaAnteriores: number = 1;

  constructor(private _authService: AuthService, private _serviceEventos: EventosService) { }

  ngOnInit(): void {
    this._serviceEventos.GetEventos().subscribe({
      next: (data) => {
        const fechaActual = new Date();
        this.eventosanteriores = data.filter((evento: Evento) => 
          new Date(evento.fechaEvento) < fechaActual
        );
        this.eventosdisponibles = data.filter((evento: Evento) => 
          new Date(evento.fechaEvento) >= fechaActual
        );
        console.log('Eventos anteriores:', this.eventosanteriores);
        console.log('Eventos disponibles:', this.eventosdisponibles);
      }
    });
  }

  logout() {
    this._authService.logout();
  }

  // Métodos de paginación para eventos disponibles
  get eventosDisponiblesPaginados(): Evento[] {
    const inicio = (this.paginaDisponibles - 1) * this.eventosPorPagina;
    const fin = inicio + this.eventosPorPagina;
    return this.eventosdisponibles?.slice(inicio, fin) || [];
  }

  get totalPaginasDisponibles(): number {
    return Math.ceil((this.eventosdisponibles?.length || 0) / this.eventosPorPagina);
  }

  siguientePaginaDisponibles(): void {
    if (this.paginaDisponibles < this.totalPaginasDisponibles) {
      this.paginaDisponibles++;
    }
  }

  anteriorPaginaDisponibles(): void {
    if (this.paginaDisponibles > 1) {
      this.paginaDisponibles--;
    }
  }

  // Métodos de paginación para eventos anteriores
  get eventosAnterioresPaginados(): Evento[] {
    const inicio = (this.paginaAnteriores - 1) * this.eventosPorPagina;
    const fin = inicio + this.eventosPorPagina;
    return this.eventosanteriores?.slice(inicio, fin) || [];
  }

  get totalPaginasAnteriores(): number {
    return Math.ceil((this.eventosanteriores?.length || 0) / this.eventosPorPagina);
  }

  siguientePaginaAnteriores(): void {
    if (this.paginaAnteriores < this.totalPaginasAnteriores) {
      this.paginaAnteriores++;
    }
  }

  anteriorPaginaAnteriores(): void {
    if (this.paginaAnteriores > 1) {
      this.paginaAnteriores--;
    }
  }

}
