import { Component, EventEmitter, OnInit, Output } from '@angular/core';

const API_BASE = 'https://apideportestajamar.azurewebsites.net/api/Deportes';

@Component({
  selector: 'app-seleccionar-deporte',
  templateUrl: './seleccionar-deporte.html',
  styleUrls: ['./seleccionar-deporte.css']
})
export class SeleccionarDeporteComponent implements OnInit {
  /**
   * SeleccionarDeporteComponent
   * - Intenta cargar la lista de deportes desde `/api/Deportes`.
   * - Si falla, usa una lista por defecto que incluye 'Ping Pong' y 'Videojuegos'.
   * - Emite el deporte seleccionado vía `deporteSeleccionado`.
   */
  @Output() deporteSeleccionado = new EventEmitter<string>();

  deportes: { id: number; nombre: string }[] = [];
  seleccionadoId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.loadDeportes();
  }

  /**
   * loadDeportes: solicita la lista de deportes a la API y la normaliza.
   * En caso de error rellena `this.deportes` con una lista por defecto.
   */
  async loadDeportes() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // if API returns array of objects with id and nombre or similar fields
      if (Array.isArray(data) && data.length) {
        this.deportes = data.map((d: any, i: number) => ({ id: d.id || d.idDeporte || i + 1, nombre: d.nombre || d.nombreDeporte || String(d) }));
      } else {
        // fallback to default list
        this.deportes = [
          { id: 1, nombre: 'Fútbol' },
          { id: 2, nombre: 'Baloncesto' },
          { id: 3, nombre: 'Ping Pong' },
          { id: 4, nombre: 'Tenis' },
          { id: 5, nombre: 'Videojuegos' }
        ];
      }
    } catch (err: any) {
      this.error = err?.message || String(err);
      // fallback list
      this.deportes = [
        { id: 1, nombre: 'Fútbol' },
        { id: 2, nombre: 'Baloncesto' },
        { id: 3, nombre: 'Ping Pong' },
        { id: 4, nombre: 'Tenis' },
        { id: 5, nombre: 'Videojuegos' }
      ];
    } finally {
      this.loading = false;
    }
  }

  /**
   * seleccionar: marca el deporte seleccionado y emite su nombre
   * a través del `EventEmitter` `deporteSeleccionado`.
   */
  seleccionar(id: number) {
    this.seleccionadoId = id;
    const d = this.deportes.find(x => x.id === id);
    if (d) this.deporteSeleccionado.emit(d.nombre);
  }
}
