import {Component, OnInit,} from '@angular/core';
import {Equipov2Service} from '../../../core/services/equipov2.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Equipov2} from '../../../models/EquipoV2';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {EMPTY, switchMap} from 'rxjs';
import {CommonModule, NgStyle} from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-seleccion-equipo',
  imports: [
    AccordionModule, CommonModule, Avatar
  ],
  templateUrl: './seleccion-equipo.component.html',
  styleUrl: './seleccion-equipo.component.css',
})
export class SeleccionEquipoComponent implements OnInit {
  idEvento!: number;
  idActividad!: number;
  usuario!: Usuario;
  equipoExpandido: number | null = null;
  openIndex: number | null = null;
  equiposDisponibles: Array<Equipov2> = [];

  constructor(private _equipoService: Equipov2Service,
              private _activeRoute: ActivatedRoute,
              private _usuarioService: UsuarioService) {
  }

  ngOnInit(): void {

    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null && parametros['idActividad'] != null) {

        console.log("golaaaa")
        this.idActividad = parametros['idActividad'];
        this.idEvento = parametros['idEvento'];
        console.log('ID del evento:', this.idEvento);

        // this.getEquiposDisponibles(this.idActividad,this.idEvento);
        this.getEquiposConJugadores(this.idActividad, this.idEvento);
        this._usuarioService.getDatosUsuario().pipe().subscribe(value => {
          this.usuario = value;
        });
      }
    });
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
    this._equipoService.getEquiposConJugadores(idActividad, idEvento).subscribe(value => {
      console.log("Los Equipos:")
      console.log(value)
      this.equiposDisponibles = value;
    })
  }

  unirseEquipo(idEquipo: number) {
    const yaTieneEquipo = this.equiposDisponibles.some(equipo =>
      equipo.jugadores?.some(jugador => jugador.idUsuario === this.usuario.idUsuario)
    );

    if (yaTieneEquipo) {
      alert('ya estás inscrito en un equipo y no se permiten cambios.');
      return;
    }

    this._equipoService.unirseEquipo(this.usuario.idUsuario, idEquipo).subscribe({
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
    this._equipoService.obtenerMiembroEspecifico(idUsuario, idEquipo).pipe(
      switchMap(miembro => {
        if (!miembro) {
          // Si no existe el miembro, lanzar un error o devolver un observable vacío
          console.log('Miembro no encontrado');
          return EMPTY; // RxJS EMPTY
        }
        // miembro.idMiembroEquipo contiene el id que necesitamos borrar
        return this._equipoService.borrarMiembroEquipo(miembro.idMiembroEquipo);
      })
    ).subscribe({
      next: result => {
        console.log('Miembro borrado exitosamente', result);
        window.location.reload();
      },
      error: err => {
        console.error('Error al borrar el miembro', err);
      }
    });
  }


}
 