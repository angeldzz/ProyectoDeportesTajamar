import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import {UsuarioService} from '../../../core/services/usuario.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    UpperCasePipe,
    RouterLink,
    FullCalendarModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
  public eventosanteriores!: Array<Evento>
  public eventosdisponibles!: Array<Evento>


  public role$!: Observable<number | null>;
  // Paginación eventos disponibles
  public paginaDisponibles: number = 1;
  public eventosPorPagina: number = 3;

  // Paginación eventos anteriores
  public paginaAnteriores: number = 1;

  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    height: 'auto',
    aspectRatio: 1.5
  };

  constructor(private _authService: AuthService,
              private _serviceEventos: EventosService) {

    this.role$ = this._authService.userRole$;
  }

  ngOnInit(): void {
    // Suscribirse al rol de manera reactiva

    this._serviceEventos.GetEventos().subscribe({
      next: (data) => {
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparación precisa

        this.eventosanteriores = data
          .filter((evento: Evento) => {
            const fechaEvento = new Date(evento.fechaEvento);
            fechaEvento.setHours(0, 0, 0, 0);
            return fechaEvento < fechaActual;
          })
          .sort((a: Evento, b: Evento) =>
            new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime()
          );

        this.eventosdisponibles = data
          .filter((evento: Evento) => {
            const fechaEvento = new Date(evento.fechaEvento);
            fechaEvento.setHours(0, 0, 0, 0);
            return fechaEvento >= fechaActual;
          })
          .sort((a: Evento, b: Evento) =>
            new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime()
          );

        // Convertir eventos para FullCalendar
        this.calendarOptions.events = data.map((evento: Evento) => {
          const fechaEvento = new Date(evento.fechaEvento);
          fechaEvento.setHours(0, 0, 0, 0);
          const esPasado = fechaEvento < fechaActual;
          return {
            id: evento.idEvento.toString(),
            title: `#${evento.idEvento}`,
            start: evento.fechaEvento,
            allDay: true,
            backgroundColor: esPasado ? '#6c757d' : '#4285f4',
            borderColor: esPasado ? '#6c757d' : '#4285f4',
            extendedProps: {
              idProfesor: evento.idProfesor
            }
          };
        });
      }
    });
  }

  handleEventClick(clickInfo: any) {
    const eventoId = clickInfo.event.id;
    window.location.href = `/seleccion_deportes/${eventoId}`;
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
