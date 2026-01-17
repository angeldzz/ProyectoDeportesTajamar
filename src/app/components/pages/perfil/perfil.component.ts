import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { PerfilService } from '../../../core/services/perfil.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit{
  public perfil: Usuario | undefined;

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
