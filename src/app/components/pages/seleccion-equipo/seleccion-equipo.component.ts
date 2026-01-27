import {Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {Equipov2Service} from '../../../core/services/equipov2.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Equipov2} from '../../../models/EquipoV2';
import {UsuarioService} from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {EMPTY, switchMap} from 'rxjs';
import {CommonModule, NgStyle} from '@angular/common';
import {AccordionModule} from 'primeng/accordion';
import {Avatar} from 'primeng/avatar';
import {FormsModule} from '@angular/forms';
import {ColoresService} from '../../../core/services/colores.service';
import {Colores} from '../../../models/Colores';
import {EventosService} from '../../../core/services/eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seleccion-equipo',
  imports: [
     AccordionModule, CommonModule, Avatar, FormsModule
  ],
  templateUrl: './seleccion-equipo.component.html',
  styleUrl: './seleccion-equipo.component.css',
})
export class SeleccionEquipoComponent implements OnInit {
  idEvento!: number;
  idActividad!: number;
  usuario!: Usuario;

  openIndex: number | null = null;
  equiposDisponibles: Array<Equipov2> = [];
  colores:Colores[] = [];
  idEventoActividad!: number;
  constructor(private _equipoService: Equipov2Service,
              private _activeRoute: ActivatedRoute,
              private _usuarioService: UsuarioService,
              private _colorService:ColoresService,
              private _eventoService:EventosService,) {
  }

  ngOnInit(): void {

    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null && parametros['idActividad'] != null) {

        console.log("golaaaa")
        this.idActividad = parametros['idActividad'];
        this.idEvento = parametros['idEvento'];

        console.log('ID del evento:', this.idEvento);

        this._eventoService.findActividadEvento(this.idEvento.toString(),this.idActividad.toString()).subscribe((value) => {
          this.idEventoActividad=value.idEventoActividad;
        })
        // this.getEquiposDisponibles(this.idActividad,this.idEvento);
        this.getEquiposConJugadores(this.idActividad, this.idEvento);
        this._usuarioService.getDatosUsuario().pipe().subscribe(value => {
          this.usuario = value;
        });
      }
    });
    this._colorService.getColores().subscribe(value => {
      this.colores=value;
    })


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
        ).subscribe({
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
        this._equipoService.borrarEquipo(idEquipo).subscribe({
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
    this._equipoService.obtenerColoresDisponibles(this.idActividad, this.idEvento).subscribe({
      next: (colores) => {
        this.coloresDisponibles = colores;
        console.log('Colores disponibles:', colores);

      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
 