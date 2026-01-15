import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from '../../../models/PerfilUsuario';
import { PerfilService } from '../../../core/services/perfil.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit{
  public perfil: PerfilUsuario | undefined;
  
  constructor(
    private _perfilService: PerfilService
  ){}
  
  ngOnInit(): void {
    this._perfilService.GetEventos().subscribe(perfil => {
      this.perfil = perfil;
      console.log(perfil);
    });
  }
}
