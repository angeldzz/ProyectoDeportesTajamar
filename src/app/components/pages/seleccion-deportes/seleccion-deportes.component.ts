import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {CarouselModule} from 'primeng/carousel';
import {DeportesService} from '../../../core/services/deportes.service';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {InscripcionesService} from '../../../core/services/inscripciones.service';
import {catchError, forkJoin, map, of, Subject, switchMap, takeUntil} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrecioService} from '../../../core/services/precio.service';

@Component({
  selector: 'app-seleccion-deportes',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
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
  constructor(private _activeRoute: ActivatedRoute,
              private _deportesService: DeportesService,
              private _usuarioService: UsuarioService,
              private _inscripcionesService: InscripcionesService,
              private _router: Router,
              private _precioService: PrecioService,) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this._activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {

        this.idEvento = parametros['idEvento'];
        console.log('ID del evento:', this.idEvento);

        this._deportesService.getDeportesEvento(Number(this.idEvento)).pipe(takeUntil(this.destroy$),
          switchMap(deportes => {
            if (!deportes || deportes.length === 0) return of([]);
            const peticiones = deportes.map(d =>
              this._precioService.getPrecioActividadById(d.idEventoActividad).pipe(takeUntil(this.destroy$),
                map(precioResp => ({ ...d, precio: precioResp })) // añade `precio` al objeto deporte
              )
            );
            return forkJoin(peticiones); // espera todas las peticiones y devuelve array con deportes+precio
          })
        ).subscribe({
          next: (deportesConPrecio) => {
            this.deportes = deportesConPrecio;
            console.log(this.deportes);
          },
          error: err => console.error(err)
        });

        this._usuarioService.getDatosUsuario().pipe(takeUntil(this.destroy$)).subscribe(value => {
          this.usario = value;
          console.log(this.usario);
        })
      }
    });
  }

  onChangeCapitan(){
    console.log("cambiado")
    this.quiereSerCapitan = !this.quiereSerCapitan;
    console.log(this.quiereSerCapitan)
  }
  inscribirseActividadEvento(idEvento: String, idActividad: number, idActividadEvento: number) {

      //TODO CAMBIAR LA RUTA POR ESTA
    // /api/UsuariosDeportes/InscribirmeEvento/{ideventoactividad}/{sercapitan}
    this._inscripcionesService.inscribirseActividadEvento(
      this.usario.idUsuario,
      idActividadEvento,
      this.quiereSerCapitan,
      new Date()
    ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this._router.navigate(['/deporte_eventos', idEvento, idActividad]),
      error: err => {
        alert("ya estas inscrito en una actividad");
        console.error(err)
      }
    })
  }
}
