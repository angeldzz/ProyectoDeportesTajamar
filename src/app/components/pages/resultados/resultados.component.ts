import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResultadoService} from '../../../core/services/resultado.service';
import {PartidoResultado} from '../../../models/PartidoResultado';
import {EventosService} from '../../../core/services/eventos.service';
import {DeportesService} from '../../../core/services/deportes.service';
import {Deporte} from '../../../models/Deportes';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
import {Evento} from '../../../models/Evento';
import {DatePipe} from '@angular/common';
import {CalendarioComponent} from '../../shared/calendario/calendario.component';
import {ResultadoDeporteEvento} from '../../../models/ResultadoDeporteEvento';

@Component({
  selector: 'app-resultados',
  imports: [
    CalendarioComponent,
    DatePipe
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})


export class ResultadosComponent implements OnInit {
  public results = [];



  constructor(private _resultadoService: ResultadoService,
              private _eventosService: EventosService,
              private _deportesService: DeportesService) {
  }

  resultados: Array<PartidoResultado> = [];
  actividades: Array<ActividadDeportes> = [];
  resultadosAgrupados: ResultadoDeporteEvento[] = [];
  eventosanteriores: Evento[] = [];
  idEventoSeleccionado: string = "2"; // Por defecto o vacío

  ngOnInit() {

    this.getEventos();
    this.cargarDatosEvento(this.idEventoSeleccionado);
  }


  cargarDatosEvento(idEvento: string) {
    if (!idEvento) return;

    this._deportesService.getDeportesEvento(idEvento).subscribe({
      next: (actividades) => {
        const diccionario = new Map<number, string>();
        actividades.forEach(a => diccionario.set(a.idEventoActividad, a.nombreActividad));

        this._resultadoService.getResultados().subscribe(partidos => {
          this.agruparPartidos(partidos, diccionario);
        });
      }
    });
  }
  cargarTodoElEvento(idEvento: string) {
    // 1. Primero traemos las actividades del evento seleccionado
    this._deportesService.getDeportesEvento(idEvento).subscribe({
      next: (actividadesEvento) => {
        this.actividades = actividadesEvento; // Para tus otros selects
        console.log(actividadesEvento)
        const diccionarioActividades = new Map<number, string>();
        actividadesEvento.forEach(act => {
          diccionarioActividades.set(act.idActividad, act.nombreActividad);
        });

        this._resultadoService.getResultadosByActividadEvento(idEvento).subscribe({
          next: (todosLosPartidos) => {
            const grupos: { [key: string]: PartidoResultado[] } = {};

            todosLosPartidos.forEach(partido => {
              const nombreDeporte = diccionarioActividades.get(partido.idEventoActividad);

              if (nombreDeporte) {
                if (!grupos[nombreDeporte]) {
                  grupos[nombreDeporte] = [];
                }
                grupos[nombreDeporte].push(partido);
              }
            });
            this.resultadosAgrupados = Object.keys(grupos).map(nombre =>
              new ResultadoDeporteEvento(nombre, grupos[nombre])
            );
          }
        });
      }
    });
  }
  private agruparPartidos(partidos: PartidoResultado[], diccionario: Map<number, string>) {
    const grupos: { [key: string]: PartidoResultado[] } = {};

    partidos.forEach(partido => {
      const nombreDeporte = diccionario.get(partido.idEventoActividad);

      // Solo agrupamos si el partido pertenece a una actividad del evento actual
      if (nombreDeporte) {
        if (!grupos[nombreDeporte]) grupos[nombreDeporte] = [];
        grupos[nombreDeporte].push(partido);
      }
    });
    this.resultadosAgrupados = Object.keys(grupos).map(nombre =>
      new ResultadoDeporteEvento(nombre, grupos[nombre])
    );
  }

  getEventos(): void {
    this._eventosService.GetEventos().subscribe({
      next: (data) => {
        const fechaActual = new Date();
        this.eventosanteriores = data.filter((evento: Evento) =>
          new Date(evento.fechaEvento) < fechaActual
        );
      }
    });
  }

  onEventoChange(idEvento: string): void {
    if (!idEvento) return;
    this.resultadosAgrupados = []; // Limpieza visual
    this.cargarTodoElEvento(idEvento);
  }
}
