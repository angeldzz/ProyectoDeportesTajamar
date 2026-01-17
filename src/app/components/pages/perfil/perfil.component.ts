import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../core/services/usuario.service';
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
    private _usuarioService: UsuarioService
  ){}

  ngOnInit(): void {
    this._usuarioService.getDatosUsuario().subscribe(perfil => {
      this.perfil = perfil;
      console.log(perfil);
    });
  }
}
