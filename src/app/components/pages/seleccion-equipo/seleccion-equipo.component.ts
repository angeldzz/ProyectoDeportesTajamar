import {Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {Equipov2Service} from '../../../core/services/equipov2.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Equipov2} from '../../../models/EquipoV2';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {EMPTY, map, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {CommonModule, NgStyle} from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {Avatar} from 'primeng/avatar';
import {FormsModule} from '@angular/forms';
import {ColoresService} from '../../../core/services/colores.service';
import {Colores} from '../../../models/Colores';
import {EventosService} from '../../../core/services/eventos.service';
import Swal from 'sweetalert2';
import {AuthService} from '../../../core/services/auth.service';
import {CapitanService} from '../../../core/services/capitan.service';
import {InscripcionesService} from '../../../core/services/inscripciones.service';

@Component({
  selector: 'app-seleccion-equipo',
  imports: [
     AccordionModule, CommonModule, Avatar, FormsModule
  ],
  templateUrl: './seleccion-equipo.component.html',
  styleUrl: './seleccion-equipo.component.css',
})
export class SeleccionEquipoComponent implements OnInit,OnDestroy  {
  idEvento!: number;
  idActividad!: number;
  usuario!: Usuario;

  openIndex: number | null = null;
  equiposDisponibles: Array<Equipov2> = [];
  colores:Colores[] = [];
  idEventoActividad!: number;
  public role$!: Observable<number | null>;

  private destroy$ = new Subject<void>();
  constructor(private _equipoService: Equipov2Service,
              private _activeRoute: ActivatedRoute,
              private _usuarioService: UsuarioService,
              private _colorService:ColoresService,
              private _eventoService:EventosService,
              private _authService:AuthService,
              private _capitanService:CapitanService,
              private _inscripcionesService:InscripcionesService,) {

    this.role$ = this._authService.userRole$;
  }

  ngOnInit(): void {
    this._activeRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((parametros: Params) => {
          this.idActividad = parametros['idActividad'];
          this.idEvento = parametros['idEvento'];

          return this._eventoService.findActividadEvento(
            this.idEvento.toString(),
            this.idActividad.toString()
          );
        }),
        switchMap(eventoActividad => {
          this.idEventoActividad = eventoActividad.idEventoActividad;

          return this._usuarioService.getDatosUsuario();
        }),
        switchMap(usuario => {
          this.usuario = usuario;

          this.comprobarUsuarioInscrito(this.idEvento,this.idActividad,this.usuario.idUsuario);

          return this._capitanService.getIdCapitanUsuario(
            this.usuario.idUsuario,
            this.idEventoActividad
          );
        }),
        switchMap(idCapitanActividad =>
          this._capitanService.getCapitanActividad(idCapitanActividad)
        )
      )
      .subscribe({
        next: capitanActividad => {
          this.capitanEventoActividad =
            capitanActividad.idEventoActividad === this.idEventoActividad;

          console.log('¿Es capitán?', this.capitanEventoActividad);


        },
        error: () => {
          this.capitanEventoActividad = false;
        }
      });

    // esto puede ir en paralelo
    this.getEquiposConJugadores(this.idActividad, this.idEvento);
    this._colorService.getColores()
      .pipe(takeUntil(this.destroy$))
      .subscribe(c => this.colores = c);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePanel(idx: number) {
    if (this.openIndex === idx) {
      // Si el mismo panel ya estaba abierto, cerrarlo
      this.openIndex = null;
    } else {
      // Abrir el panel seleccionado y cerrar los demás
      this.openIndex = idx;
    }

  }
  getEquiposConJugadores(idActividad: number, idEvento: number) {
    this._equipoService.getEquiposConJugadores(idActividad, idEvento)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        console.log("Los Equipos:")
        console.log(value)
        this.equiposDisponibles = value;
      });
  }

  unirseEquipo(idEquipo: number) {
    const yaTieneEquipo = this.equiposDisponibles.some(equipo =>
      equipo.jugadores?.some(jugador => jugador.idUsuario === this.usuario.idUsuario)
    );

    if (yaTieneEquipo) {
      alert('ya estás inscrito en un equipo y no se permiten cambios.');
      return;
    }

    this._equipoService.unirseEquipo(this.usuario.idUsuario, idEquipo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Te has unido con éxito');
          this.getEquiposConJugadores(this.idActividad, this.idEvento);
        },
        error: (err) => {
          alert('Hubo un error al intentar unirse al equipo.');
        }
      });
  }

  get usuarioYaEstaInscrito(): boolean {
    return this.equiposDisponibles.some(equipo =>
      equipo.jugadores?.some(miembro => miembro.idUsuario === this.usuario?.idUsuario)
    );
  }

  borrarMiembroEquipoPorUsuario(idUsuario: number, idEquipo: number) {
    this._equipoService.obtenerMiembroEspecifico(idUsuario, idEquipo)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(miembro => {
          if (!miembro) {
            console.log('Miembro no encontrado');
            return EMPTY;
          }
          return this._equipoService.borrarMiembroEquipo(miembro.idMiembroEquipo).pipe(takeUntil(this.destroy$));
        })
      )
      .subscribe({
        next: result => {
          console.log('Miembro borrado exitosamente', result);
          window.location.reload();
        },
        error: err => {
          console.error('Error al borrar el miembro', err);
        }
      });
  }


  nombreEquipo: string = '';
  numJugadores!: number;
  color!: number;

  crearEquipo(){
    Swal.fire({
      title: "Estas seguro?",
      text: "No podras revertir la accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Crear Equipo",
    }).then((result) => {
      if (result.isConfirmed) {
        this._equipoService.crearEquipo(
          this.idEventoActividad,
          this.nombreEquipo,
          this.numJugadores,
          this.color,
          this.usuario.idCurso
        ).pipe(takeUntil(this.destroy$)).subscribe({
          next: value => {
            Swal.fire({
              title: "Equipo Creado",
              text: "El equipo se ha creado con exito.",
              icon: "success"
            });
            console.log('Equipo creado', value)
            window.location.reload();
          },
          error: err => {
            Swal.fire({
              title: "Fallo",
              text: "No se ha podido crear el equipo.",
              icon: "error"
            });
            console.error('Error al crear equipo', err)}
        });

      }
    });
  }

  borrarEquipo(idEquipo: number) {
    Swal.fire({
      title: "Estas seguro?",
      text: "No podras revertir la accion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borrar"
    }).then((result) => {
      if (result.isConfirmed) {
        this._equipoService.borrarEquipo(idEquipo).pipe(takeUntil(this.destroy$)).subscribe({
          next: value => {
            Swal.fire({
              title: "Borrado",
              text: "El equipo se ha borrado con exito.",
              icon: "success"
            });
            console.log('Equipo borrado', value)
            window.location.reload();
          },
          error: err => {
            Swal.fire({
              title: "Fallo",
              text: "No se ha podido borrar el equipo.",
              icon: "error"
            });
            console.error('Error al borrar equipo', err)}
        });

      }
  });
}

  coloresDisponibles: any[] = [];
  abrirModalCrearEquipo(): void {
    this._equipoService.obtenerColoresDisponibles(this.idActividad, this.idEvento).pipe(takeUntil(this.destroy$)).subscribe({
      next: (colores) => {
        this.coloresDisponibles = colores;
        console.log('Colores disponibles:', colores);

      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  capitanEventoActividad: boolean = false;


   comprobarCapitan(idUsuario: number, idEventoActividad: number) {
    this._capitanService
      .getIdCapitanUsuario(idUsuario, idEventoActividad)
      .pipe(
        switchMap(idCapitanActividad =>
          this._capitanService.getCapitanActividad(idCapitanActividad)
        )
      )
      .subscribe({
        next: (capitanActividad) => {
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          if (capitanActividad.idEventoActividad === idEventoActividad) {
            console.log('Capitán válido:', capitanActividad);
            console.log(capitanActividad);
            this.capitanEventoActividad=true;

          } else {
            console.warn('No coincide el evento actividad');
            this.capitanEventoActividad=false;

          }
        },
        error: err => {

          console.error('Error comprobando capitán', err);
          this.capitanEventoActividad=false;

        }

      });

  }

  get botonUnirseDeshabilitado(): boolean {
    return (
      this.usuarioYaEstaInscrito ||
      !this.usuarioInscritoEventoActual
    );
  }

  usuarioInscritoEventoActual: boolean = false;

  comprobarUsuarioInscrito(idEvento: number, idActividad: number, idUsuario: number): void {
      console.log("wefwedfgewrgewsgt4eg")
    this._inscripcionesService
      .getNumeroInscipcionesEventoActividad(idEvento, idActividad)
      .pipe(
        map(inscripciones =>
          inscripciones.some(i => i.idUsuario === idUsuario)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (estaInscrito: boolean) => {
          console.log('¿Usuario inscrito?', estaInscrito);
          if(estaInscrito) {
            this.usuarioInscritoEventoActual=true
          }
          // aquí guardas el boolean
        },
        error: () => {
          this.usuarioInscritoEventoActual=false
          console.error('Error comprobando inscripción');
        }
      });
  }

}
