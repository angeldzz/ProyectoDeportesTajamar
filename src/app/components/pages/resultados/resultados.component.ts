import { Component, OnInit } from '@angular/core';
import { DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';

import { ResultadoService } from '../../../core/services/resultado.service';
import { EventosService } from '../../../core/services/eventos.service';
import { DeportesService } from '../../../core/services/deportes.service';

import { PartidoResultado } from '../../../models/PartidoResultado';
import { Evento } from '../../../models/Evento';
import { ResultadoDeporteEvento } from '../../../models/ResultadoDeporteEvento';
import { CalendarioComponent } from '../../shared/calendario/calendario.component';
import {Colores} from '../../../models/Colores';
import {Equipov2} from '../../../models/EquipoV2';
import {Equipov2Service} from '../../../core/services/equipov2.service';
import {Usuario} from '../../../models/Usuario';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    CalendarioComponent,
    DatePipe,
    NgIf
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit {

  resultadosAgrupados: ResultadoDeporteEvento[] = [];
  eventosanteriores: Evento[] = [];
  idEventoSeleccionado: string = "2";
  loadingPlayers: boolean = false;
  jugadoresEquipo!:Array<Usuario>;

  usariosEquipo!:Array<Equipov2>;
  constructor(
    private _resultadoService: ResultadoService,
    private _eventosService: EventosService,
    private _deportesService: DeportesService,
    private _equiposService: Equipov2Service
  ) {}

  async ngOnInit() {
    await this.getEventos();

    if (this.idEventoSeleccionado) {
      await this.cargarDatosEvento(this.idEventoSeleccionado);
    }
  }

  async getEventos() {
    try {
      const data = await lastValueFrom(this._eventosService.GetEventos());
      const fechaActual = new Date();
      this.eventosanteriores = data.filter((evento: Evento) =>
        new Date(evento.fechaEvento) < fechaActual
      );
    } catch (error) {
      console.error('Error cargando eventos:', error);
    }
  }

  async cargarDatosEvento(idEvento: string) {
    if (!idEvento) return;

    try {

      const [actividades, partidosEnriquecidos] = await Promise.all([
        lastValueFrom(this._deportesService.getDeportesEvento(idEvento)),
        lastValueFrom(this._resultadoService.getResultadosWithEquipos(idEvento))
      ]);
      // TODO MIRAR SI CON VARIABLE SE MEJORA
      partidosEnriquecidos.forEach(partido => {
        (partido as any).colorLocalCss =
          this.getVariableColor(partido.infoLocal?.infoColor);

        (partido as any).colorVisitanteCss =
          this.getVariableColor(partido.infoVisitante?.infoColor);
      });

      const mapaDeportes = new Map<number, string>();
      actividades.forEach(act => mapaDeportes.set(act.idEventoActividad, act.nombreActividad));

      const grupos: { [key: string]: PartidoResultado[] } = {};

      partidosEnriquecidos.forEach(partido => {

        const nombreDeporte = mapaDeportes.get(partido.idEventoActividad);

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

      console.log("Resultados Listos:", this.resultadosAgrupados);

    } catch (error) {
      console.error('Error cargando datos:', error);
      this.resultadosAgrupados = [];
    }
  }

  getVariableColor(color: Colores | undefined | null): string {
    if (!color?.nombreColor) return 'var(--color-default)';

    const clave = color?.nombreColor.toLowerCase().trim();

    return `var(--color-${clave}, var(--color-default))`;
  }

  verPlantilla(idEquipo:number) {
    if (!idEquipo) return;


    this.loadingPlayers = true;

    // Llamada al servicio
    this._equiposService.getMiembrosEquipoById(idEquipo).subscribe({
      next: (data) => {
        this.jugadoresEquipo = data;
        this.loadingPlayers = false;
        console.log("Jugadores cargados:", data);
      },
      error: (e) => {
        console.error(e);
        this.loadingPlayers = false;
      }
    });
  }

  async onEventoChange(idEvento: string) {
    if (!idEvento) return;
    this.idEventoSeleccionado = idEvento;
    this.resultadosAgrupados = [];
    await this.cargarDatosEvento(idEvento);
  }
}
