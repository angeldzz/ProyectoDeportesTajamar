import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {Equipov2} from '../../models/EquipoV2';
import {Usuario} from '../../models/Usuario';

@Injectable({providedIn: 'root'})
export class Equipov2Service {


  constructor(private _http: HttpClient) {
  }


  getEquiposEvento(idEvento: string): Observable<any[]> {

    let url = environment.urlEquipos + "EquiposEvento/" + idEvento
    return this._http.get<any[]>(url);
  }

  getMiembrosEquipoById(idEquipo:number):Observable<Array<Usuario>>{
    let url = environment.urlEquipos+"UsuariosEquipo/"+idEquipo

    return this._http.get<Array<Usuario>>(url);
  }

  getEquipoById(idEquipo:number):Observable<Equipov2>{
    let url= environment.urlEquipos+idEquipo;

    return this._http.get<Equipov2>(url);
  }
}
