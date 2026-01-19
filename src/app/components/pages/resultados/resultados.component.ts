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

@Component({
  selector: 'app-resultados',
  imports: [
    DatePipe
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit {

  constructor(private _resultadoService:ResultadoService,
              private _eventosService:EventosService,
              private _deportesService: DeportesService) { }

  resultados!:Array<PartidoResultado>;
  actividades!:Array<ActividadDeportes>;
  eventos!:Array<Evento>;
  public eventosanteriores!: Array<Evento>
  ngOnInit() {
    this.getResultados();
    this.getEventos();
  }

  getResultados():void{
    this._resultadoService.getResultados().subscribe(value =>
    {
      console.log(value)
      this.resultados = value

    })
  }

  getEventos()  :void{
    this._eventosService.GetEventos().subscribe({
      next: (data) => {
        const fechaActual = new Date();
        this.eventosanteriores = data.filter((evento: Evento) =>
          new Date(evento.fechaEvento) < fechaActual
        );
        console.log('Eventos anteriores:', this.eventosanteriores);
      }
    });
  }
  onEventoChange(idEvento: String): void {
    if (!idEvento) {
      this.actividades = []; // Limpiamos si no hay selección
      return;
    }
    this._deportesService.getDeportesEvento(idEvento).subscribe(value => {
      this.actividades = value;
    });
  }

  findResultadosByActividadEvento(idEventoActividad:String):void{
    if (!idEventoActividad) {
      this.resultados = [];
      return
    }
    this._resultadoService.getResultadosByActividadEvento(idEventoActividad).subscribe(value => {
      console.log(value)
      this.resultados = value
    })
  }
}
