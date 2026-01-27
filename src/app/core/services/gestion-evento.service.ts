import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, of } from "rxjs";
import { catchError, concatMap, filter, map, take, toArray } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";
import { Usuario } from "../../models/Usuario";
import { CursosActivos } from "../../models/CursosActivos";

@Injectable({
  providedIn: 'root'
})
export class GestionEventoService {
  constructor(private _http: HttpClient) { }

  getCursosActivos(): Observable<Array<CursosActivos>> {
    return this._http.get<Array<CursosActivos>>(environment.urlGestionEvento + 'CursosActivos');
  }

  /**
   * Intenta llamar varios posibles endpoints para obtener usuarios de un curso.
   * Devuelve el primer resultado válido que encuentre.
   */
  getUsuariosPorCurso(idCurso: number): Observable<Usuario[] | null> {
    const base = environment.urlGestionEvento;
    const candidates = [
      `UsuarioCurso/${idCurso}`,
      `UsuariosCurso/${idCurso}`,
      `UsuarioCursos/${idCurso}`,
      `Usuarios/Curso/${idCurso}`,
      `Usuario/Curso/${idCurso}`,
      `UsuariosCurso?idCurso=${idCurso}`
    ];

    return from(candidates).pipe(
      concatMap(suffix => this._http.get<any>(base + suffix).pipe(
        catchError(() => of(null))
      )),
      filter(res => res != null),
      map(res => {
        // Si la respuesta tiene un objeto con datos dentro (p.e. { data: [...] })
        if (Array.isArray(res)) return res as Usuario[];
        if (res && Array.isArray(res.data)) return res.data as Usuario[];
        // Si responde un objeto vacío o un usuario único, intentar normalizar
        if (res && typeof res === 'object') {
          // buscar propiedades que parezcan lista
          const possible = Object.values(res).find(v => Array.isArray(v));
          if (Array.isArray(possible)) return possible as Usuario[];
        }
        return null;
      }),
      filter(arr => arr !== null),
      take(1),
      // Si no encontró nada, devolver null
      catchError(() => of(null))
    );
  }
}

