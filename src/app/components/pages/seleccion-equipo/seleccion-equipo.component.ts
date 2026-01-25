
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

const API_EQUIPOS = 'https://apideportestajamar.azurewebsites.net/api/Equipos';

@Component({
  selector: 'app-seleccion-equipo',
  imports: [],
  templateUrl: './seleccion-equipo.component.html',
  styleUrl: './seleccion-equipo.component.css',
})
export class SeleccionEquipoComponent implements OnInit {
  /**
   * Componente para listar y seleccionar equipos.
   * - Carga la lista completa desde `/api/Equipos`.
   * - Al seleccionar un equipo carga sus usuarios con `/api/Equipos/UsuariosEquipo/{idequipo}`.
   * - Emite el equipo seleccionado por medio de `equipoSeleccionado` si se desea usar desde padre.
   */
  @Output() equipoSeleccionado = new EventEmitter<any>();

  equipos: any[] = [];
  filtro: string = '';
  loading = false;
  error: string | null = null;

  selectedEquipo: any = null;
  miembros: any[] = [];
  loadingMiembros = false;

  constructor() {}

  ngOnInit(): void {
    this.loadEquipos();
  }

  /**
   * loadEquipos: obtiene la lista de equipos desde la API y guarda en `this.equipos`.
   * Maneja `loading` y `error` para feedback en la UI.
   */
  async loadEquipos() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(API_EQUIPOS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.equipos = await res.json();
    } catch (err: any) {
      this.error = err?.message || String(err);
      this.equipos = [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * filteredEquipos: devuelve la lista de equipos filtrada por `this.filtro`.
   */
  filteredEquipos() {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.equipos;
    return this.equipos.filter((e: any) => {
      const nombre = (e.nombreEquipo || e.nombre || '').toString().toLowerCase();
      return nombre.includes(q);
    });
  }

  /**
   * selectEquipo: marca un equipo como seleccionado y carga sus miembros.
   * Emite el equipo seleccionado por `equipoSeleccionado`.
   */
  selectEquipo(e: any) {
    this.selectedEquipo = e;
    this.equipoSeleccionado.emit(e);
    this.loadMiembrosEquipo(e.idEquipo ?? e.id ?? 0);
  }

  /**
   * loadMiembrosEquipo: solicita a la API los usuarios de un equipo concreto.
   * Endpoint: GET `/api/Equipos/UsuariosEquipo/{idequipo}`
   */
  async loadMiembrosEquipo(idequipo: number) {
    this.loadingMiembros = true;
    this.miembros = [];
    try {
      const res = await fetch(`${API_EQUIPOS}/UsuariosEquipo/${idequipo}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.miembros = await res.json();
    } catch (err: any) {
      // No detener la experiencia: mostrar error en UI
      this.error = err?.message || String(err);
      this.miembros = [];
    } finally {
      this.loadingMiembros = false;
    }
  }

  /**
   * clearSelection: limpia la selección actual y la lista de miembros.
   */
  clearSelection() {
    this.selectedEquipo = null;
    this.miembros = [];
  }
}
