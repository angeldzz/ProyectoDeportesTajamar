import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css']
})
export class EventosComponent implements OnInit {
  /**
   * Componente `EventosComponent`.
   * - Carga eventos desde la API pública.
   * - Permite crear, actualizar y eliminar eventos.
   * - Mantiene estado de formulario y selección para edición.
   */
  eventos: any[] = [];
  filtro: string = '';
  loading = false;
  error: string | null = null;

  // simple form for create/update
  form: { idEvento?: number | null; fechaEvento?: string; titulo?: string; lugar?: string; descripcion?: string } = {};
  selected: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  /**
   * loadEventos: obtiene la lista de eventos desde la API.
   * Actualiza `this.eventos`, `this.loading` y `this.error`.
   */
  async loadEventos() {
    this.loading = true;
    this.error = null;
    try {
      const data: any[] = await firstValueFrom(this.http.get<any[]>(environment.urlEventos));
      this.eventos = (data || []).map((it: any) => ({
        id: it.idEvento ?? it.id ?? null,
        titulo: it.nombreEvento ?? it.titulo ?? it.nombre ?? '',
        fecha: it.fechaEvento ?? it.fecha ?? '',
        lugar: it.lugar ?? it.localidad ?? '',
        descripcion: it.descripcion ?? it.descripcionEvento ?? '',
        equipoLocal: it.equipoLocal ?? it.equipo_local ?? null,
        equipoVisitante: it.equipoVisitante ?? it.equipo_visitante ?? null
      }));
    } catch (err: any) {
      this.error = err?.message || String(err);
      this.eventos = [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * eventosFiltrados: filtra la lista local `this.eventos` usando `this.filtro`.
   * Devuelve los eventos cuyo título, lugar o descripción contengan la búsqueda.
   */
  eventosFiltrados() {
    const q = this.filtro.trim().toLowerCase();
    if (!q) return this.eventos;
    return this.eventos.filter(e =>
      (e.titulo || '').toLowerCase().includes(q) ||
      (e.lugar || '').toLowerCase().includes(q) ||
      (e.descripcion || '').toLowerCase().includes(q)
    );
  }

  /**
   * selectEvento: marca un evento como seleccionado y rellena el formulario
   * con los datos del evento para una posible edición.
   */
  selectEvento(ev: any) {
    this.selected = ev;
    this.form = { idEvento: ev.id, fechaEvento: ev.fecha, titulo: ev.titulo, lugar: ev.lugar, descripcion: ev.descripcion };
  }

  /**
   * clearSelection: limpia la selección y el estado del formulario.
   */
  clearSelection() {
    this.selected = null;
    this.form = {};
  }

  /**
   * crearEvento: crea un nuevo evento en la API.
   * Implementa el endpoint documentado `POST /api/Eventos/create/{datofecha}`
   * donde `datofecha` se toma de `form.fechaEvento`.
   */
  async crearEvento() {
    this.error = null;
    try {
      const datofecha = this.form.fechaEvento || '';
      await firstValueFrom(this.http.post(`${environment.urlEventos}create/${encodeURIComponent(datofecha)}`, {}));
      await this.loadEventos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }

  /**
   * actualizarEvento: envía los datos del formulario al endpoint `PUT /api/Eventos/update`
   * para actualizar el evento en la API y recarga la lista.
   */
  async actualizarEvento() {
    this.error = null;
    try {
      const body = { idEvento: this.form.idEvento, fechaEvento: this.form.fechaEvento, nombreEvento: this.form.titulo, lugar: this.form.lugar, descripcion: this.form.descripcion };
      await firstValueFrom(this.http.put(`${environment.urlEventos}update`, body));
      await this.loadEventos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }

  /**
   * eliminarEvento: elimina un evento llamando a `DELETE /api/Eventos/{id}`
   * y refresca la lista si la operación tiene éxito.
   */
  async eliminarEvento(id: number) {
    this.error = null;
    if (!confirm('¿Eliminar evento?')) return;
    try {
      await firstValueFrom(this.http.delete(`${environment.urlEventos}${id}`));
      await this.loadEventos();
      this.clearSelection();
    } catch (err: any) {
      this.error = err?.message || String(err);
    }
  }
}