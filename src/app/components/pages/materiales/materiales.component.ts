import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Materiales } from '../../../models/Materiales';
import { MaterialesService } from '../../../core/services/materiales.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import {Usuario} from '../../../models/Usuario';
import {CursosActivos} from '../../../models/CursosActivos';
import {switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {EventosService} from '../../../core/services/eventos.service';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {
  lista: any[] = [];
  masters: CursosActivos[] = [];
  usuarios: Usuario[] = [];
  model: any = { pendiente: false };
  editingId: number | null = null;
  loading: boolean = false;

  constructor(
    private _materialesService: MaterialesService,
    private _usuarioService: UsuarioService,
    private _http: HttpClient,
    private _activeRoute: ActivatedRoute,
    private _eventoService: EventosService
  ) { }

  idActividad!:number;
  idEvento!:number;
  eventoAct!:number;
  ngOnInit(): void {


    this._activeRoute.params.subscribe(params => {
      this.idActividad = params['idActividad'];
      this.idEvento = params['idEvento'];

      return this._eventoService.findActividadEvento(
        this.idEvento.toString(),
        this.idActividad.toString()).subscribe(data=>{
          this.eventoAct=data.idEventoActividad;
      });
    }  );
    this.loadAll();
    this.loadAuxiliarData();
    }


  loadAuxiliarData(): void {
    // Solo cargamos los Masters al principio
    this._http.get<CursosActivos[]>('https://apideportestajamar.azurewebsites.net/api/GestionEvento/CursosActivos').subscribe({
      next: (res: any) => {
        this.masters = Array.isArray(res) ? res : (res.value || []);
      },
      error: (err: any) => console.error('Error masters:', err)
    });
  }

  onMasterChange(idCurso: any): void {
    if (!idCurso) return;

    this.loading = true;
    this.usuarios = []; // Limpiamos la lista anterior

    // Asumiendo que getUsuariosByCurso recibe el ID por parámetro
    this._usuarioService.getUsuariosByCurso(idCurso).subscribe({
      next: (res: any) => {
        // Si la API devuelve el objeto con .value, úsalo; si es array directo, res
        this.usuarios = Array.isArray(res) ? res : (res.value || []);
        this.loading = false;
        console.log(this.usuarios);
      },
      error: (err: any) => {
        console.error('Error cargando alumnos:', err);
        this.loading = false;
      }
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

    const fechaHoy = new Date().toISOString();
    const payload: any = {
      idMaterial: this.editingId ? this.editingId : 0,
      idEventoActividad: this.eventoAct,
      idUsuario: Number(this.model.idUsuario),
      nombreMaterial: this.model.nombreMaterial,
      pendiente: !!this.model.pendiente,
      fechaSolicitud: fechaHoy
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

    // Disparamos la carga de alumnos para el curso que ya tiene el material
    if (this.model.idEventoActividad) {
      this.onMasterChange(this.model.idEventoActividad);
    }
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
