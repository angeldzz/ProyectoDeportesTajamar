import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {CarouselModule} from 'primeng/carousel';
import {DeportesService} from '../../../core/services/deportes.service';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {InscripcionesService} from '../../../core/services/inscripciones.service';
import {catchError} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
export class SeleccionDeportesComponent implements OnInit {

  public idEvento!: String;
  public deportes!: Array<ActividadDeportes>;
  public usario!: Usuario;
  public quiereSerCapitan: boolean=false;
  constructor(private _activeRoute: ActivatedRoute,
              private _deportesService: DeportesService,
              private _usuarioService: UsuarioService,
              private _inscripcionesService: InscripcionesService,
              private _router: Router,) {
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {

        this.idEvento = parametros['idEvento'];
        console.log('ID del evento:', this.idEvento);

        this._deportesService.getDeportesEvento(Number(this.idEvento)).subscribe(value => {
          this.deportes = value;
          console.log(this.deportes);
        });

        this._usuarioService.getDatosUsuario().subscribe(value => {
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
    ).subscribe({
      next: () => this._router.navigate(['/deporte_eventos', idEvento, idActividad]),
      error: err => {
        alert("ya estas inscrito en una actividad");
        console.error(err)
      }
    })
  }
}
