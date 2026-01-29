import {Component, OnInit} from '@angular/core';
import {OrganizadoresService} from '../../../../core/services/organizadores.service';
import {UsuarioService} from '../../../../core/services/usuario.service';
import {Usuario} from '../../../../models/Usuario';
import {CursosActivos} from '../../../../models/CursosActivos';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-organizadores',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './organizadores.component.html',
  styleUrl: './organizadores.component.css',
})
export class OrganizadoresComponent implements OnInit {

  constructor(private _organizadoresService: OrganizadoresService,
              private _usuarioService: UsuarioService,) { }


  cursos: CursosActivos[] = [];
  usuariosCurso: Usuario[] = [];

  cursoSeleccionado!: number;
  usuarioSeleccionado!: number;

  ngOnInit() {
    this._usuarioService.getCursosActivos()
      .subscribe(cursos => this.cursos = cursos);
  }

  onCursoChange(): void {
    this.usuarioSeleccionado = 0;
    this.usuariosCurso = [];

    if (!this.cursoSeleccionado) return;

    this._usuarioService
      .getUsuariosByCurso(this.cursoSeleccionado)
      .subscribe(usuarios => this.usuariosCurso = usuarios);
  }

  crearOrganizador(usuario:number){
    this._organizadoresService.crearOrganizador(usuario).subscribe(value => {
      console.log(value);
    })
  }

  borrarOrganizador(usuario:number){
    this._organizadoresService.borrarOrganizador(usuario).subscribe(value => {
      console.log(value);
    })
  }

}
