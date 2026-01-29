import { Component, OnInit } from '@angular/core';
import { DeportesService } from '../../../core/services/deportes.service';
import { Deporte } from '../../../models/Deportes';
import { ActividadDeportes } from '../../../models/ActividadDeportes';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../../core/services/eventos.service';
import { Evento } from '../../../models/Evento';
import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PickListModule } from 'primeng/picklist';
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
  
  deportesDisponibles: DeportePicklist[] = [];
  deportesSeleccionados: DeportePicklist[] = [];
  deportesSeleccionadosOriginales: DeportePicklist[] = []; // Para comparar qué se eliminó
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
      
      this.deportesSeleccionados = seleccionados;
      this.deportesSeleccionadosOriginales = [...seleccionados]; // Guardar copia del estado original
      
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
        
        this.deportesDisponibles = deportesFiltrados;
      });
    });
  }
  public LoadEvento () {
    const idEvento = this.route.snapshot.params['idEvento'];
      this._serviceEvento.GetEventoIndividual(idEvento).subscribe(result => {
      this.evento = result;
      // Load deportes after evento is loaded
      this.LoadDeportes();
    })
  }
  public AsignarActividades() {
    const deportesSelecionadosActuales = this.deportesSeleccionados;
    const idevento = this.evento.idEvento;
    
    // Detectar deportes a crear (nuevos, sin idEventoActividad)
    const deportesNuevos = deportesSelecionadosActuales.filter(deporte => 
      !deporte.idEventoActividad || deporte.idEventoActividad === 0
    );

    // Detectar deportes a eliminar (estaban en originales pero ya no están en actuales)
    const idsActuales = deportesSelecionadosActuales.map(d => d.idActividad);
    const deportesAEliminar = this.deportesSeleccionadosOriginales.filter(deporte => 
      deporte.idEventoActividad && !idsActuales.includes(deporte.idActividad)
    );

    // Si no hay cambios
    if (deportesNuevos.length === 0 && deportesAEliminar.length === 0) {
      Swal.fire({
          title: 'Sin cambios',
          text: `No hay cambios para aplicar`,
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      return;
    }

    // Mostrar loading mientras se procesan los cambios
    const totalCambios = deportesNuevos.length + deportesAEliminar.length;
    Swal.fire({
      title: 'Procesando cambios...',
      html: `Creando: ${deportesNuevos.length}<br>Eliminando: ${deportesAEliminar.length}`,
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    // Primero eliminar las actividades removidas, luego crear las nuevas
    if (deportesAEliminar.length > 0) {
      // Eliminar primero
      this.eliminarActividadesSecuencial(deportesAEliminar, 0, [], [], () => {
        // Después de eliminar, crear las nuevas
        if (deportesNuevos.length > 0) {
          this.asignarActividadesSecuencial(deportesNuevos, idevento, 0, [], []);
        } else {
          // Solo había eliminaciones
          this.LoadDeportes();
          Swal.fire({
            title: '¡Éxito!',
            text: `${deportesAEliminar.length} actividad(es) eliminada(s) correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      // Solo hay creaciones
      this.asignarActividadesSecuencial(deportesNuevos, idevento, 0, [], []);
    }
  }



  private eliminarActividadesSecuencial(
    deportes: DeportePicklist[], 
    index: number, 
    exitosos: string[], 
    fallidos: {nombre: string, error: string}[],
    onComplete: () => void
  ) {
    // Caso base: si ya procesamos todos los deportes
    if (index >= deportes.length) {
      onComplete();
      return;
    }

    const deporte = deportes[index];
    
    if (!deporte.idEventoActividad) {
      console.warn(`⚠ Deporte ${deporte.nombre} no tiene idEventoActividad, saltando...`);
      this.eliminarActividadesSecuencial(deportes, index + 1, exitosos, fallidos, onComplete);
      return;
    }
    
    // Eliminar la actividad actual
    this._serviceEvento.EliminarActividad_Evento(deporte.idEventoActividad).subscribe({
      next: () => {
        exitosos.push(deporte.nombre || `ID ${deporte.idActividad}`);
        // Continuar con la siguiente actividad
        this.eliminarActividadesSecuencial(deportes, index + 1, exitosos, fallidos, onComplete);
      },
      error: (error) => {
        console.error(`✗ Error al eliminar actividad ${deporte.nombre}:`, error);
        const mensajeError = error.status === 404 ? 'No encontrada' : 
                           error.status === 500 ? 'Error del servidor' : error.message;
        fallidos.push({
          nombre: deporte.nombre || `ID ${deporte.idActividad}`,
          error: mensajeError
        });
        // Continuar con la siguiente actividad incluso si esta falló
        this.eliminarActividadesSecuencial(deportes, index + 1, exitosos, fallidos, onComplete);
      }
    });
  }

  private asignarActividadesSecuencial(
    deportes: DeportePicklist[], 
    idEvento: number, 
    index: number, 
    exitosos: string[], 
    fallidos: {nombre: string, error: string}[]
  ) {
    // Caso base: si ya procesamos todos los deportes
    if (index >= deportes.length) {
      // Recargar las listas para reflejar el estado actual
      this.LoadDeportes();
      
      // Mostrar resultado final
      if (fallidos.length === 0) {
        Swal.fire({
          title: '¡Éxito!',
          text: `${exitosos.length} actividad(es) asignada(s) correctamente`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else if (exitosos.length === 0) {
        Swal.fire({
          title: 'Error',
          html: `No se pudo asignar ninguna actividad:<br>${fallidos.map(f => `• ${f.nombre}: ${f.error}`).join('<br>')}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      } else {
        Swal.fire({
          title: 'Completado con advertencias',
          html: `${exitosos.length} actividad(es) asignada(s) correctamente<br>${fallidos.length} fallida(s):<br>${fallidos.map(f => `• ${f.nombre}`).join('<br>')}`,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
      return;
    }

    const deporte = deportes[index];
    
    // Asignar la actividad actual
    this._serviceEvento.AsignarActividad_Evento(idEvento, deporte.idActividad).subscribe({
      next: () => {
        exitosos.push(deporte.nombre || `ID ${deporte.idActividad}`);
        // Continuar con la siguiente actividad
        this.asignarActividadesSecuencial(deportes, idEvento, index + 1, exitosos, fallidos);
      },
      error: (error) => {
        console.error(`✗ Error al asignar actividad ${deporte.nombre}:`, error);
        const mensajeError = error.status === 500 ? 'Ya existe o error del servidor' : error.message;
        fallidos.push({
          nombre: deporte.nombre || `ID ${deporte.idActividad}`,
          error: mensajeError
        });
        // Continuar con la siguiente actividad incluso si esta falló
        this.asignarActividadesSecuencial(deportes, idEvento, index + 1, exitosos, fallidos);
      }
    });
  }
}
