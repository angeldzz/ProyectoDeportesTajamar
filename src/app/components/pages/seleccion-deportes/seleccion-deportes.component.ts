import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {CarouselModule} from 'primeng/carousel';
import {DeportesService} from '../../../core/services/deportes.service';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {InscripcionesService} from '../../../core/services/inscripciones.service';
import {catchError, forkJoin, map, Observable, of, Subject, switchMap, takeUntil} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrecioService} from '../../../core/services/precio.service';
import {CapitanService} from '../../../core/services/capitan.service';
import {AuthService} from '../../../core/services/auth.service';
import {Evento} from '../../../models/Evento';
import {EventosService} from '../../../core/services/eventos.service';
import {ActividadEvento} from '../../../models/ActividadEvento';
import Swal from 'sweetalert2';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-seleccion-deportes',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './seleccion-deportes.component.html',
  styleUrl: './seleccion-deportes.component.css',
})
export class SeleccionDeportesComponent implements OnInit, OnDestroy {

  public idEvento!: String;
  public deportes!: Array<ActividadDeportes>;
  public usario!: Usuario;
  public quiereSerCapitan: boolean=false;
  private destroy$ = new Subject<void>();
  public role$!: Observable<number | null>;
  public loading: boolean = false;
  constructor(private _activeRoute: ActivatedRoute,
              private _deportesService: DeportesService,
              private _usuarioService: UsuarioService,
              private _inscripcionesService: InscripcionesService,
              private _router: Router,
              private _precioService: PrecioService,
              private _capitanService:CapitanService,
              private _authService: AuthService,
              private _eventoService:EventosService,) {

    this.role$ = this._authService.userRole$;
  }

  public yaInscrito: boolean = false;

  eventoPasado:boolean = false;
  datosEvento!:Evento;

  ngOnInit(): void {
    this._activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {


        this.idEvento = parametros['idEvento'];
        console.log('ID del evento:', this.idEvento);

        this._eventoService.GetEventoIndividual(Number(this.idEvento)).subscribe(value => {
          this.datosEvento=value;

         this.eventoPasado= this.eventoEstaPasado(this.datosEvento.fechaEvento);

        });
        this.loading = true;
        this._deportesService.getDeportesEvento(Number(this.idEvento)).pipe(takeUntil(this.destroy$),
          switchMap(deportes => {
            if (!deportes || deportes.length === 0) return of([]);
            const peticiones = deportes.map(d =>
              this._precioService.getPrecioActividadById(d.idEventoActividad).pipe(takeUntil(this.destroy$),
                map(precioResp => ({ ...d, precio: precioResp, }))

              )
            );

            return forkJoin(peticiones);
          })
        ).subscribe({
          next: (deportesConPrecio) => {
            this.deportes = deportesConPrecio;
            this.loading = false;
            console.log(this.deportes);
          },
          error: err => {
            console.error(err);
            this.loading = false;
          }
        });

        this._usuarioService.getDatosUsuario().pipe(
          takeUntil(this.destroy$),
          switchMap(user => {
            this.usario = user;

            return this._inscripcionesService.getInscripcionesByIdEvento(Number(this.idEvento)).pipe(takeUntil(this.destroy$));
          })
        ).subscribe({
          next: (inscritos: any[]) => {
            this.yaInscrito = inscritos.some(i => i.idUsuario === this.usario.idUsuario);
            console.log("¿Usuario ya inscrito en este evento?", this.yaInscrito);
          },
          error: err => console.error("Error al comprobar inscritos:", err)
        });
      }
    });
  }


    public modalDatos :ActividadEvento|null= null;


  abrirModalCapitan(deporte: any): void {
    // Guarda los 3 valores para usarlos dentro del modal
    this.modalDatos = {
      idEvento: Number(this.idEvento),
      idActividad: Number(deporte.idActividad),
      idEventoActividad: Number(deporte.idEventoActividad),
    };

    // Opcional: reset de UI del modal
    this.quiereSerCapitan = false;
  }
  inscribirseDesdeModal(): void {
    if (!this.modalDatos) return;
    if (this.yaInscrito || this.eventoPasado) return;

    this.inscribirseActividadEvento(
      this.modalDatos.idEvento.toString(),
      this.modalDatos.idActividad,
      this.modalDatos.idEventoActividad
    );
  }
  private eventoEstaPasado(fechaEvento: string | Date | null | undefined): boolean {
    if (!fechaEvento) return false;

    const fecha = fechaEvento instanceof Date ? fechaEvento : new Date(fechaEvento);
    if (Number.isNaN(fecha.getTime())) return false;

    return fecha.getTime() < Date.now();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  inscribirseActividadEvento(idEvento: String, idActividad: number, idActividadEvento: number) {
    this._inscripcionesService.inscribirseActividadEvento(
      this.usario.idUsuario,
      idActividadEvento,
      this.quiereSerCapitan,
      new Date()
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.yaInscrito = true;
        this._router.navigate(['/deporte_eventos', idEvento, idActividad]);
      },
      error: err => {
        this.yaInscrito = true;
        alert("Ya estás inscrito en una actividad");
        console.error(err);
      }
    });
  }



  onChangeCapitan(): void {
    // Aquí ya se ha actualizado `esCapitan` por el [(ngModel)]
    console.log('¿Es capitán?: ', this.quiereSerCapitan);
    // lógica extra si hace falta
  }

  confirmarCapitan(): void {
    // lógica para guardar/mandar al backend que es o no es capitán
    console.log('Confirmado capitán: ', this.quiereSerCapitan);
  }


//TODO FUNCION DE ADMINISTRADOR
  public usuariosPorCurso = new Map<number, Usuario[]>();

  private getRandomUsuario(usuarios: Usuario[]): Usuario {
    const index = Math.floor(Math.random() * usuarios.length);
    return usuarios[index];
  }

   procesarActividades(): void {

    this.deportes.forEach(actividad => {
      this.escogerCapitanesPorActividad(actividad.idEventoActividad,actividad.idActividad);
    });
  }
  public capitanesPorCurso: Usuario[] = [];

  private escogerCapitanesPorActividad(idEventoActividad: number,idActividad:number): void {
    this._capitanService
      .getUsuariosQuierenCapiByEvento(Number(this.idEvento),idActividad )
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarios: Usuario[]) => {

        const usuariosPorCurso = new Map<number, Usuario[]>();

        usuarios.forEach(usuario => {
          if (!usuariosPorCurso.has(usuario.idCurso)) {
            usuariosPorCurso.set(usuario.idCurso, []);
          }
          usuariosPorCurso.get(usuario.idCurso)!.push(usuario);
        });

        usuariosPorCurso.forEach((usuariosCurso) => {
          const capitan =
            usuariosCurso[Math.floor(Math.random() * usuariosCurso.length)];

          this._capitanService.asignarCapitanEventoActividad(
            idEventoActividad,
            capitan.idUsuario
          ).subscribe(value =>
          {
            this.role$ = this._authService.userRole$;
          });
        });
      });
  }


  public idPrecioSeleccionado: number | null = null;
  public idEventoActividadActual: number | null = null;
  public precioInput: string = "";

// Función para preparar el modal (llamar desde tu lista de deportes)
  prepararModal(idEventoActividad: number, precioExistente?: any) {
    this.idEventoActividadActual = idEventoActividad;

    if (precioExistente) {

      this.idPrecioSeleccionado = precioExistente.idPrecioActividad;
      this.precioInput = precioExistente.precioTotal;

    } else {
      this.idPrecioSeleccionado = null;
      this.precioInput = "";
    }
  }
  @ViewChild('btnCerrar') btnCerrar!: ElementRef;

  guardarPrecio() {
    if (this.idPrecioSeleccionado) {
      this._precioService.updatePrecioEventoActividad(
        this.idPrecioSeleccionado,
        this.idEventoActividadActual!,
        this.precioInput
      ).subscribe({
        next: () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Precio Modificado Exitosamente",
            showConfirmButton: false,
            timer: 1500
          }).then(r => {
            this.btnCerrar.nativeElement.click();
            this.recarga()
          });
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else {
      this._precioService.createPrecioEventoActividad(
        0,
        this.idEventoActividadActual!,
        this.precioInput
      ).subscribe({
        next: () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Precio Creado Exitosamente",
            showConfirmButton: false,
            timer: 1500
          }).then(r => {
            this.btnCerrar.nativeElement.click();
            this.recarga()
          });


        },
        error: (e) => {
          console.error(e)
        }
      });
    }
  }


  recarga() {
    this.loading = true; // Iniciamos el estado de carga

    this._deportesService.getDeportesEvento(Number(this.idEvento)).pipe(
      takeUntil(this.destroy$),
      switchMap(deportes => {
        if (!deportes || deportes.length === 0) return of([]);
        const peticiones = deportes.map(d =>
          this._precioService.getPrecioActividadById(d.idEventoActividad).pipe(
            takeUntil(this.destroy$),
            map(precioResp => ({ ...d, precio: precioResp }))
          )
        );
        return forkJoin(peticiones);
      })
    ).subscribe({
      next: (deportesConPrecio) => {
        this.deportes = deportesConPrecio;
        this.loading = false; // Éxito: quitamos loader
      },
      error: err => {
        console.error(err);
        this.loading = false; // Error: también quitamos loader
      }
    });
  }


}
