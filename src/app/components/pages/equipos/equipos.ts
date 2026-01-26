import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [],
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

  constructor(private http: HttpClient) {}

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
      const res = await firstValueFrom(this.http.get<any[]>(environment.urlEquipos));
      this.equipos = res || [];
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
      const body = {
        nombreEquipo: this.form.nombreEquipo || '',
        minimoJugadores: this.form.minimoJugadores || 0,
        idColor: this.form.idColor || 0,
        idCurso: this.form.idCurso || 0,
        idEventoActividad: this.form.idEventoActividad || 0
      };
      await firstValueFrom(this.http.post(`${environment.urlEquipos}create`, body));
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
      const body = {
        idEquipo: this.form.idEquipo,
        nombreEquipo: this.form.nombreEquipo || '',
        minimoJugadores: this.form.minimoJugadores || 0,
        idColor: this.form.idColor || 0,
        idCurso: this.form.idCurso || 0,
        idEventoActividad: this.form.idEventoActividad || 0
      };
      await firstValueFrom(this.http.put(`${environment.urlEquipos}update`, body));
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
      await firstValueFrom(this.http.delete(`${environment.urlEquipos}${id}`));
      await this.loadEquipos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }
}
