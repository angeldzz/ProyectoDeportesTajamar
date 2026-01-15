import { Component, OnInit } from '@angular/core';

const API_BASE = 'https://apideportestajamar.azurewebsites.net/api/Equipos';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.html',
  styleUrls: ['./equipos.css']
})
export class EquiposComponent implements OnInit {
  /**
   * EquiposComponent
   * - Gestiona la lista de equipos consumiendo `/api/Equipos`.
   * - Provee operaciones CRUD: listar, crear, actualizar y eliminar.
   * - Mantiene un pequeño formulario local en `this.form` para crear/editar.
   */
  equipos: any[] = [];
  selected: any = null;
  loading = false;
  error: string | null = null;

  // form state (used for create/update)
  form: {
    idEquipo?: number | null;
    nombreEquipo?: string;
    minimoJugadores?: number | null;
    idColor?: number | null;
    idCurso?: number | null;
    idEventoActividad?: number | null;
  } = {};

  constructor() {}

  ngOnInit(): void {
    this.loadEquipos();
  }

  /**
   * loadEquipos: obtiene la lista de equipos desde la API y actualiza
   * `this.equipos`. Maneja `loading` y `error`.
   */
  async loadEquipos() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(API_BASE);
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
   * selectEquipo: marca un equipo como seleccionado y copia sus
   * valores en `this.form` para poder editar.
   */
  selectEquipo(e: any) {
    this.selected = e;
    this.form = {
      idEquipo: e.idEquipo,
      nombreEquipo: e.nombreEquipo,
      minimoJugadores: e.minimoJugadores,
      idColor: e.idColor,
      idCurso: e.idCurso,
      idEventoActividad: e.idEventoActividad
    };
  }

  /**
   * clearSelection: resetea la selección y el formulario local.
   */
  clearSelection() {
    this.selected = null;
    this.form = {};
  }

  /**
   * crearEquipo: crea un nuevo equipo usando `POST /api/Equipos/create`.
   * Envía los campos necesarios tomados de `this.form`.
   */
  async crearEquipo() {
    this.error = null;
    try {
      const body = JSON.stringify({
        nombreEquipo: this.form.nombreEquipo || '',
        minimoJugadores: this.form.minimoJugadores || 0,
        idColor: this.form.idColor || 0,
        idCurso: this.form.idCurso || 0,
        idEventoActividad: this.form.idEventoActividad || 0
      });
      const res = await fetch(`${API_BASE}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this.loadEquipos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }

  /**
   * actualizarEquipo: actualiza un equipo existente mediante
   * `PUT /api/Equipos/update` con el objeto del formulario.
   */
  async actualizarEquipo() {
    this.error = null;
    try {
      const body = JSON.stringify({
        idEquipo: this.form.idEquipo,
        nombreEquipo: this.form.nombreEquipo || '',
        minimoJugadores: this.form.minimoJugadores || 0,
        idColor: this.form.idColor || 0,
        idCurso: this.form.idCurso || 0,
        idEventoActividad: this.form.idEventoActividad || 0
      });
      const res = await fetch(`${API_BASE}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this.loadEquipos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }

  /**
   * eliminarEquipo: elimina un equipo llamando a `DELETE /api/Equipos/{id}`
   * y refresca la lista si se completa correctamente.
   */
  async eliminarEquipo(id: number) {
    this.error = null;
    if (!confirm('¿Eliminar equipo?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await this.loadEquipos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }
}
