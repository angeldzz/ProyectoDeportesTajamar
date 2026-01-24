import { Component, OnInit, signal } from '@angular/core';
import { DeportesService } from '../../../core/services/deportes.service';
import { Deporte } from '../../../models/Deportes';
import { ActividadDeportes } from '../../../models/ActividadDeportes';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PickListModule } from 'primeng/picklist';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

registerLocaleData(localeEs);

// Tipo unificado para el picklist que combina Deporte y ActividadDeportes
type DeportePicklist = Deporte & { idEventoActividad?: number };

@Component({
  selector: 'app-asignacion-actividad-evento.component',
  imports: [DatePipe, CommonModule, PickListModule],
  templateUrl: './asignacion-actividad-evento.component.html',
  styleUrl: './asignacion-actividad-evento.component.css'
})
export class AsignacionActividadEventoComponent implements OnInit{
  constructor(private _serviceDeportes: DeportesService, 
              private _serviceEvento: EventosService,
              private router: Router, 
              private route: ActivatedRoute){}
  
  deportesDisponibles = signal<DeportePicklist[]>([]);
  deportesSeleccionados = signal<DeportePicklist[]>([]);
  public evento!: Evento;
  
  ngOnInit(): void {
    this.LoadEvento();
  }
  public LoadDeportes () {
    this._serviceDeportes.getDeportesEvento(this.evento.idEvento).subscribe(response => {
      // Convertir ActividadDeportes a DeportePicklist
      const seleccionados: DeportePicklist[] = response.map(act => ({
        idActividad: act.idActividad,
        nombre: act.nombreActividad,
        minimoJugadores: act.minimoJugadores,
        idEventoActividad: act.idEventoActividad
      }));
      
      this.deportesSeleccionados.set(seleccionados);
      console.log("Deportes en evento:");
      console.log(seleccionados);
      
      // Cargar deportes disponibles después de obtener los seleccionados
      this._serviceDeportes.getDeportes().subscribe(todosDeportes => {
        // Filtrar deportes que ya están asignados al evento
        const idsSeleccionados = response.map(d => d.idActividad);
        const deportesFiltrados: DeportePicklist[] = todosDeportes
          .filter(deporte => !idsSeleccionados.includes(deporte.idActividad))
          .map(deporte => ({
            ...deporte,
            idEventoActividad: undefined
          }));
        
        this.deportesDisponibles.set(deportesFiltrados);
        console.log("Deportes disponibles (filtrados):");
        console.log(deportesFiltrados);
      });
    });
  }
  public LoadEvento () {
    const idEvento = this.route.snapshot.params['idEvento'];
      this._serviceEvento.GetEventoIndividual(idEvento).subscribe(result => {
      this.evento = result;
      console.log("Id evento: " + this.evento.idEvento);
      // Load deportes after evento is loaded
      this.LoadDeportes();
    })
  }
  public AsignarActividades() {
    const deportesSelecionadosActuales = this.deportesSeleccionados();
    const idevento = this.evento.idEvento;
    
    if (deportesSelecionadosActuales.length === 0) {
      Swal.fire({
          title: 'Actividades Asignadas',
          text: `No hay deportes seleccionados`,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      return;
    }

    // Filtrar solo los deportes que NO tienen idEventoActividad asignado (recién seleccionados)
    const deportesNuevos = deportesSelecionadosActuales.filter(deporte => 
      !deporte.idEventoActividad || deporte.idEventoActividad === 0
    );

    if (deportesNuevos.length === 0) {
      Swal.fire({
          title: 'Sin cambios',
          text: `Todos los deportes ya están asignados al evento`,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      return;
    }

    const peticiones = deportesNuevos.map(deporte => 
      this._serviceEvento.AsignarActividad_Evento(idevento, deporte.idActividad).pipe(
        catchError(error => {
          console.error(`Error al asignar actividad ${deporte.nombre}:`, error);
          return of({ error: true, deporte: deporte.nombre, mensaje: error.message });
        })
      )
    );

    forkJoin(peticiones).subscribe({
      next: (responses) => {
        const exitosos = responses.filter(r => !r.error);
        const fallidos = responses.filter(r => r.error);
        
        Swal.fire({
          title: 'Actividades Asignadas',
          text: `${exitosos.length} actividades asignadas correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        if (fallidos.length > 0) {
          console.warn(`${fallidos.length} actividades no pudieron ser asignadas:`, fallidos);
        }
      },
      error: (error) => {
        console.error('Error inesperado:', error);
      }
    });
  }
}
