import { Component, OnInit } from '@angular/core';
import { GestionEventoService } from '../../../core/services/gestion-evento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clases-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clases-alumnos.component.html',
  styleUrls: ['./clases-alumnos.component.css']
})
export class ClasesAlumnosComponent implements OnInit {
  cursos: any[] = [];
  alumnos: any[] = [];
  loadingCursos = false;
  loadingAlumnos = false;
  idCursoInput: number | null = null;

  constructor(private gestionEvento: GestionEventoService) { }

  ngOnInit(): void {
    // cargar cursos activos como referencia (opcional)
    this.loadCursos();
  }

  loadCursos() {
    this.loadingCursos = true;
    this.gestionEvento.getCursosActivos().subscribe({
      next: (c) => { this.cursos = c || []; this.loadingCursos = false; },
      error: () => { this.cursos = []; this.loadingCursos = false; }
    });
  }

  buscarPorId() {
    const id = this.idCursoInput;
    if (!id) { this.alumnos = []; return; }
    this.loadingAlumnos = true;
    this.gestionEvento.getUsuariosPorCurso(id).subscribe({
      next: (u:any) => { 
        this.alumnos = u || [];
        this.loadingAlumnos = false; 
      },
      error: (err:any) => { 
        this.alumnos = [];
        this.loadingAlumnos = false;
        console.error('Error al obtener usuarios por curso', err);
      },
      complete: () => {
        // si no se emitió resultado (observador completa sin valores), mostrar vacío
        if (!this.alumnos) this.alumnos = [];
      }
    });
  }

  // util: si la API no incluye `nombre`/`apellidos`, mostramos campos alternativos
  displayNombre(u: any) {
    return u?.nombre ?? u?.usuario ?? u?.usuarioNombre ?? u?.nombreUsuario ?? '';
  }

  displayApellidos(u: any) {
    return u?.apellidos ?? u?.surname ?? u?.apellido ?? '';
  }
}
