import {Component, OnDestroy, OnInit} from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import {forkJoin, lastValueFrom, pipe, Subject, takeUntil} from 'rxjs';

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
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    Avatar
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit ,OnDestroy {

  resultadosAgrupados: ResultadoDeporteEvento[] = [];
  eventosanteriores: Evento[] = [];
  idEventoSeleccionado: string = "2";
  loadingPlayers: boolean = false;
  isInitialLoad: boolean = true;
  jugadoresEquipoLocal!:Array<Usuario>;
  jugadoresEquipoVisitante!:Array<Usuario>;
  arrNombreEquipo:[string, string]=["",""];


  private destroy$ = new Subject<void>();

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async getEventos() {
    try {
      const data = await lastValueFrom(this._eventosService.GetEventos().pipe(takeUntil(this.destroy$)));
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
    this.isInitialLoad = true;
    this.resultadosAgrupados = [];
    try {

      const [actividades, partidosEnriquecidos] = await Promise.all([
        lastValueFrom(this._deportesService.getDeportesEvento(idEvento).pipe(takeUntil(this.destroy$))),
        lastValueFrom(this._resultadoService.getResultadosWithEquipos(idEvento).pipe(takeUntil(this.destroy$)))
      ]);


          //Metemos cada color a su partido/equipo
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
    }finally {
      this.isInitialLoad = false;
    }
  }

  getVariableColor(color: Colores | undefined | null): string {
    if (!color?.nombreColor) return 'var(--color-default)';

    const clave = color?.nombreColor.toLowerCase().trim();

    return `var(--color-${clave}, var(--color-default))`;
  }

  async verPlantilla(idEquipoLocal:number,idEquipoVisitante:number,nombresEquipos:[string,string]) {
    if (!idEquipoLocal || !idEquipoVisitante) return;


    this.loadingPlayers = true;
    this.arrNombreEquipo=nombresEquipos;

    const peticionLocal = this._equiposService.getMiembrosEquipoById(idEquipoLocal);
    const peticionVisitante = this._equiposService.getMiembrosEquipoById(idEquipoVisitante);

    forkJoin({
      locales: peticionLocal,
      visitantes: peticionVisitante
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.jugadoresEquipoLocal=data.locales;
          this.jugadoresEquipoVisitante=data.visitantes;

          this.loadingPlayers = false;
          console.log("Ambos equipos cargados con éxito");
        },error:(e)=>{
          console.error("Error al cargar algun equipo",e);
          this.loadingPlayers = false;
        }
      })
  }

  async onEventoChange(idEvento: string) {
    if (!idEvento) return;
    this.idEventoSeleccionado = idEvento;
    this.resultadosAgrupados = [];
    await this.cargarDatosEvento(idEvento);
  }

  protected readonly console = console;
}
