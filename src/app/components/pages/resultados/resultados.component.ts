import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {forkJoin, lastValueFrom, Observable, pipe, Subject, takeUntil} from 'rxjs';

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
import {FormsModule} from '@angular/forms';
import {UsuarioService} from '../../../core/services/usuario.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    DatePipe,
    Avatar,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit ,OnDestroy {

  resultadosAgrupados: ResultadoDeporteEvento[] = [];
  eventosanteriores: Evento[] = [];
  idEventoSeleccionado: number = 2;
  loadingPlayers: boolean = false;
  isInitialLoad: boolean = true;
  jugadoresEquipoLocal!:Array<Usuario>;
  jugadoresEquipoVisitante!:Array<Usuario>;
  arrNombreEquipo:[string, string]=["",""];
  public role$!: Observable<number | null>;
  equipos!:Array<Equipov2>;
  private destroy$ = new Subject<void>();

  constructor(
    private _resultadoService: ResultadoService,
    private _eventosService: EventosService,
    private _deportesService: DeportesService,
    private _equiposService: Equipov2Service,
    private _authService: AuthService,
  ) {
    this.role$ = this._authService.userRole$;
  }

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

  deportesFiltrados!:{ id: number; nombre: string }[]
  async cargarDatosEvento(idEvento: number) {
    if (!idEvento) return;
    this.isInitialLoad = true;
    this.resultadosAgrupados = [];
    try {

      const [actividades, partidosEnriquecidos] = await Promise.all([
        lastValueFrom(this._deportesService.getDeportesEvento(idEvento).pipe(takeUntil(this.destroy$))),
        lastValueFrom(this._resultadoService.getResultadosWithEquipos(idEvento).pipe(takeUntil(this.destroy$)))
      ]);
        console.log("Actividades",actividades);

          //Metemos cada color a su partido/equipo
      partidosEnriquecidos.forEach(partido => {
        (partido as any).colorLocalCss =
          this.getVariableColor(partido.infoLocal?.infoColor);

        (partido as any).colorVisitanteCss =
          this.getVariableColor(partido.infoVisitante?.infoColor);
      });

      const mapaDeportes = new Map<number, string>();


      actividades.forEach(act => mapaDeportes.set(act.idEventoActividad, act.nombreActividad));

      console.log("Actividades 2",mapaDeportes);

      this.deportesFiltrados = Array.from(mapaDeportes, ([id, nombre]) => ({ id, nombre }));
      console.log(this.deportesFiltrados);
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

      this.resultadosAgrupados = Object.keys(grupos).map(nombre => {
        const grupo = new ResultadoDeporteEvento(nombre, grupos[nombre]);
        (grupo as any).expandido = true;
        return grupo;
      });
      console.log("Resultados Listos:", this.resultadosAgrupados);

    } catch (error) {
      console.error('Error cargando datos:', error);
      this.resultadosAgrupados = [];
    }finally {
      this.isInitialLoad = false;
    }
  }
  toggleGrupo(grupo: any) {
    grupo.expandido = !grupo.expandido;
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

  async onEventoChange(idEvento: number) {
    if (!idEvento) return;
    this.idEventoSeleccionado = idEvento;
    this.resultadosAgrupados = [];
    await this.cargarDatosEvento(idEvento);

  }

  selectedActividad: number | null = null;
  selectedLocal: number | null = null;
  selectedVisitante: number | null = null;
  cajapuntosLocal: number | null = null;
  cajapuntosVisitante: number | null = null;

  onLocalChange(id: number | null) {
    this.selectedLocal = id;
  }


  get equiposLocal() {
    if (!this.equipos) return [];
    return this.equipos.filter(e => e.idEquipo !== this.selectedVisitante);
  }

  get equiposVisitante() {
    if (!this.equipos) return [];
    return this.equipos.filter(e => e.idEquipo !== this.selectedLocal);
  }

  onVisitanteChange(id: number | null) {
    this.selectedVisitante = id;
  }
  onChangeActividad(idEventoActividad: number) {

    this.selectedLocal = null;
    this.selectedVisitante = null;

    this._equiposService.getActividadAndEvento(idEventoActividad)
      .subscribe(value => {
        this._equiposService
          .getEquiposByEventoActividad(value.idActividad, value.idEvento)
          .subscribe(data => {
            this.equipos = data;
          });
      });
  }

  crearResultado() {
    if (
      this.selectedActividad == null ||
      this.selectedLocal == null ||
      this.selectedVisitante == null ||
      this.cajapuntosLocal == null ||
      this.cajapuntosVisitante == null
    ) {
      alert('Completa todos los campos');
      return;
    }

    if (this.selectedLocal === this.selectedVisitante) {
      alert('Local y visitante no pueden ser el mismo equipo');
      return;
    }

    this._resultadoService.crearResultado(
      this.selectedActividad,
      this.selectedLocal,
      this.selectedVisitante,
      this.cajapuntosLocal,
      this.cajapuntosVisitante
    ).subscribe({
      next: () => {
        alert('Resultado creado correctamente');

        // Reset
        this.selectedLocal = null;
        this.selectedVisitante = null;
        this.cajapuntosLocal = null;
        this.cajapuntosVisitante = null;

        // Recargar resultados
        this.cargarDatosEvento(this.idEventoSeleccionado).then(r => {});

      },
      error: (err) => {
        console.error(err);
        alert('Error al crear resultado');
      }
    });
  }
  //Es para parsear
  protected readonly parseInt = parseInt;
}
