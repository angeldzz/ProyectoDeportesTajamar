import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {Usuario} from "../../models/Usuario";
import { ActividadDeportesInscrito } from "../../models/ActividadDeporteInscrito";
import { ActividadDeportes } from "../../models/ActividadDeportes";
import {CursosActivos} from '../../models/CursosActivos';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient) {
  }

  getDatosUsuario(): Observable<Usuario> {
    return this._http.get<Usuario>(environment.urlUsuariosDeportes + "Perfil");
  }
  getActividadesUser():Observable<Array<ActividadDeportesInscrito>>{
    return this._http.get<Array<ActividadDeportesInscrito>>(environment.urlUsuariosDeportes + "ActividadesUser");
  }

  getCursosActivos(){
    return this._http.get<Array<CursosActivos>>(environment.urlGestionEvento + "CursosActivos");
  }

  getUsuariosByCurso(idCurso: number): Observable<Usuario[]> {
    return this._http.get<Usuario[]>(
      environment.urlGestionEvento + 'UsuariosCurso/' + idCurso
    );
  }
}
