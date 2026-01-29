import {Component, OnInit} from '@angular/core';
import {OrganizadoresService} from '../../../../core/services/organizadores.service';
import {UsuarioService} from '../../../../core/services/usuario.service';
import {Usuario} from '../../../../models/Usuario';
import {CursosActivos} from '../../../../models/CursosActivos';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Avatar} from 'primeng/avatar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organizadores',
  imports: [
    FormsModule,
    NgForOf,
    Avatar
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
  organizadores!: Array<Usuario>;
  ngOnInit() {
    this._usuarioService.getCursosActivos()
      .subscribe(cursos => this.cursos = cursos);

    this.getOrganizadores();
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
    this._organizadoresService.crearOrganizador(usuario).subscribe({
      next:(value)=>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Organizador creado exitosamente",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error:(e)=>{
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No se ha podido crear",
          showConfirmButton: false,
          timer: 1000
        });
      }
    })
  }

  borrarOrganizador(usuario:number){
    this._organizadoresService.borrarOrganizador(usuario).subscribe({
      next:(value)=>{
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Organizador borrado exitosamente",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error:(e)=>{
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No se ha podido borrar",
          showConfirmButton: false,
          timer: 1000
        });
      }
    })
  }


  getOrganizadores(){
    this._organizadoresService.getOrganizadores().subscribe(value => {
      this.organizadores = value;
      console.log(value);
    })
  }

}
