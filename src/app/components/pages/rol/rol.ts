import { Component, OnInit } from '@angular/core';

const API_BASE = 'https://apideportestajamar.azurewebsites.net/api/GestionEvento/Roles';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.html',
  styleUrls: ['./rol.css']
})
export class RolComponent implements OnInit {
  /**
   * RolComponent
   * - Carga la lista de roles desde la API `/api/GestionEvento/Roles`.
   * - Mantiene estado de carga y posibles errores.
   */
  roles: { id: number; nombre: string; descripcion?: string }[] = [];
  seleccionado: number | null = null;
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadRoles();
  }

  /**
   * loadRoles: solicita al endpoint la lista de roles y mapea
   * la respuesta al formato `{id, nombre, descripcion}`.
   * Actualiza `roles`, `loading` y `error`.
   */
  async loadRoles() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.roles = (data || []).map((it: any) => ({ id: it.idRole ?? it.id ?? 0, nombre: it.role ?? it.nombre ?? String(it), descripcion: it.descripcion ?? '' }));
    } catch (err: any) {
      this.error = err?.message || String(err);
      this.roles = [];
    } finally {
      this.loading = false;
    }
  }

  /**
   * seleccionarRol: marca un rol como seleccionado por su `id`.
   */
  seleccionarRol(id: number) {
    this.seleccionado = id;
  }
}