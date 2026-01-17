import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {CarouselModule} from 'primeng/carousel';
import {DeportesService} from '../../../core/services/deportes.service';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {InscripcionesService} from '../../../core/services/inscripciones.service';
import {catchError} from 'rxjs';

@Component({
  selector: 'app-seleccion-deportes',
  imports: [
    RouterLink
  ],
  templateUrl: './seleccion-deportes.component.html',
  styleUrl: './seleccion-deportes.component.css',
})
export class SeleccionDeportesComponent implements OnInit {

  public idEvento!: number;
  public deportes!: Array<ActividadDeportes>;
  private usario!: Usuario;


  constructor(private _activeRoute: ActivatedRoute,
              private _deportesService: DeportesService,
              private _usuarioService: UsuarioService,
              private _inscripcionesService: InscripcionesService,
              private _router: Router,) {
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {

        this.idEvento = Number(parametros['idEvento']);
        console.log('ID del evento:', this.idEvento);

        this._deportesService.getDeportesEvento(this.idEvento).subscribe(value => {
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

  inscribirseActividadEvento(idEvento: number, idActividad: number, idActividadEvento: number) {
    this._inscripcionesService.inscribirseActividadEvento(
      this.usario.idUsuario,
      idActividadEvento,
      this.usario.estadoUsuario,
      new Date()
    ).subscribe({
      next: () => this._router.navigate(['/deporte_eventos', idEvento, idActividad]),
      error: err => console.error(err)
    })
  }
}
