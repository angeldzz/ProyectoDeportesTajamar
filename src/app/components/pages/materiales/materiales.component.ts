import { Component, OnInit } from '@angular/core';
import { Materiales } from '../../../models/Materiales';
import { MaterialesService } from '../../../core/services/materiales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.css']
})
export class MaterialesComponent implements OnInit {
  lista: Materiales[] = [];
  model: Partial<Materiales> = {};
  editingId: number | null = null;
  loading = false;

  constructor(private materialesService: MaterialesService) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(){
    this.loading = true;
    this.materialesService.getAll().subscribe({next: r=>{this.lista = r || []; this.loading=false}, error: ()=>{this.lista=[]; this.loading=false}})
  }

  submit(){
    const payload = {
      idMaterial: this.editingId ?? undefined,
      idEventoActividad: this.model.idEventoActividad,
      idUsuario: this.model.idUsuario,
      nombreMaterial: this.model.nombreMaterial,
      pendiente: !!this.model.pendiente,
      fechaSolicitud: this.model.fechaSolicitud
    } as Partial<Materiales>;

    this.loading = true;
    if(this.editingId){
      this.materialesService.update(this.editingId, payload).subscribe({
        next:_=>{ this.resetForm(); this.loadAll(); this.loading = false },
        error: err => { console.error('Error actualizando material', err); alert('Error actualizando'); this.loading = false }
      })
    } else {
      this.materialesService.create(payload).subscribe({
        next:_=>{ this.resetForm(); this.loadAll(); this.loading = false },
        error: err => { console.error('Error creando material', err); alert('Error creando'); this.loading = false }
      })
    }
  }

  edit(item: Materiales){
    this.editingId = item.idMaterial;
    this.model = {...item};
  }

  remove(id: number){
    if(!confirm('Confirmar eliminación')) return;
    this.materialesService.delete(id).subscribe({next:_=>this.loadAll()});
  }

  resetForm(){
    this.model = {};
    this.editingId = null;
  }
}
