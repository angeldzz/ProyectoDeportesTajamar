import { Component, OnInit, signal } from '@angular/core';
import { DeportesService } from '../../../core/services/deportes.service';
import { Deporte } from '../../../models/Deportes';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PickListModule } from 'primeng/picklist';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

registerLocaleData(localeEs);

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
  
  deportesDisponibles = signal<Deporte[]>([]);
  deportesSeleccionados = signal<Deporte[]>([]);
  public evento!: Evento;
  
  ngOnInit(): void {
    this.LoadDeportes();
    this.LoadEvento();
  }
  public LoadDeportes () {
    this._serviceDeportes.getDeportes().subscribe(response => {
    this.deportesDisponibles.set(response);
    console.log(response);
    })
  }
  public LoadEvento () {
    const idEvento = this.route.snapshot.params['idEvento'];
      this._serviceEvento.GetEventoIndividual(idEvento).subscribe(result => {
      this.evento = result;
      console.log(this.evento);
    })
  }
  public AsignarActividades() {
    const deportesSelecionadosActuales = this.deportesSeleccionados();
    const idevento = this.evento.idEvento;
    
    if (deportesSelecionadosActuales.length === 0) {
      console.warn('No hay deportes seleccionados');
      return;
    }

    const peticiones = deportesSelecionadosActuales.map(deporte => 
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
        
        console.log(`${exitosos.length} actividades asignadas correctamente`);
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
