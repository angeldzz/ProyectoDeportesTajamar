import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Materiales } from '../../../models/Materiales';
import { MaterialesService } from '../../../core/services/materiales.service';
import { UsuarioService } from '../../../core/services/usuario.service'; 

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {
  lista: any[] = [];
  masters: any[] = [];
  usuarios: any[] = [];
  
  model: any = { pendiente: false };
  editingId: number | null = null;
  loading: boolean = false;

  constructor(
    private _materialesService: MaterialesService,
    private _usuarioService: UsuarioService,
    private _http: HttpClient 
  ) { }

  ngOnInit(): void {
    this.loadAll();
    this.loadAuxiliarData();
  }

  loadAuxiliarData(): void {
    // Si 'getUsuarios' da error, prueba con 'get' o revisa tu usuario.service.ts
    // He puesto (this._usuarioService as any) para que TypeScript no bloquee la compilación por el nombre del método
    (this._usuarioService as any).getUsuarios().subscribe({
      next: (res: any) => { this.usuarios = res; },
      error: (err: any) => {
        console.log("Intentando método alternativo .get()...");
        (this._usuarioService as any).get().subscribe((res: any) => this.usuarios = res);
      }
    });

    // Carga de Masters directa
    this._http.get<any[]>('https://apideportestajamar.azurewebsites.net/api/Masters').subscribe({
      next: (res: any) => { this.masters = res; },
      error: (err: any) => console.error('Error masters:', err)
    });
  }

  loadAll(): void {
    this.loading = true;
    this._materialesService.getAll().subscribe({
      next: (res: any) => {
        this.lista = res || [];
        this.loading = false;
      },
      error: () => {
        this.lista = [];
        this.loading = false;
      }
    });
  }

  submit(): void {
    const payload: any = {
      idMaterial: this.editingId ? this.editingId : 0,
      idEventoActividad: Number(this.model.idEventoActividad),
      idUsuario: Number(this.model.idUsuario),
      nombreMaterial: this.model.nombreMaterial,
      pendiente: !!this.model.pendiente,
      fechaSolicitud: this.model.fechaSolicitud
    };

    this.loading = true;
    if (this.editingId) {
      this._materialesService.update(this.editingId, payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => { console.error(err); this.loading = false; }
      });
    } else {
      this._materialesService.create(payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => { console.error(err); this.loading = false; }
      });
    }
  }

  handleSuccess(): void {
    this.resetForm();
    this.loadAll();
    this.loading = false;
  }

  edit(item: any): void {
    this.editingId = item.idMaterial;
    this.model = { ...item };
  }

  remove(id: number): void {
    if (!confirm('¿Eliminar?')) return;
    this._materialesService.delete(id).subscribe({
      next: () => this.loadAll()
    });
  }

  resetForm(): void {
    this.model = { pendiente: false };
    this.editingId = null;
  }
}