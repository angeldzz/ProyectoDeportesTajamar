import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {Usuario} from '../../models/Usuario';

@Injectable({providedIn: 'root'})
export class CapitanService {

  constructor(private _http: HttpClient) {
  }


  getCapitanEventoActividad(idUsuario: number, idEventoActividad: number): Observable<number> {

    let url = environment.urlCapitanActividades + "GetIdCapitanUsuario/" + idUsuario + "/" + idEventoActividad

    return this._http.get<number>(url);
  }


  getUsuariosQuierenCapiByEvento(idEvento: number, idActividad: number): Observable<Array<Usuario>> {

    let url = environment.urlInscripciones + "InscripcionesUsuariosEventoCapitanActividad/" + idEvento + "?idactividad=" + idActividad;

    return this._http.get<Array<Usuario>>(url);
  }

  asignarCapitanEventoActividad(idEventoActividad:number,idUsuario:number):Observable<any> {
    let url = environment.urlCapitanActividades + "create"
      console.log(idEventoActividad);
      console.log(idUsuario);

    const body = {
      "idCapitanActividad": 0,
      "idEventoActividad": idEventoActividad,
      "idUsuario": idUsuario
    }

    return this._http.post(url, body);
  }


  comprobarCapitanEventoActividad(idUsuario:number,idEventoActividad:number){

  }

  getIdCapitanUsuario(idUsuario: number, idEventoActividad: number): Observable<number> {

    let url= environment.urlCapitanActividades+"GetIdCapitanUsuario/"+idUsuario+"/"+idEventoActividad
    console.log("ENTRO EN LA FUNCIO-------------------")
    return this._http.get<number>(url);
  }

  getCapitanActividad(idCapitanActividad: number): Observable<any> {
    const url = `${environment.urlCapitanActividades}${idCapitanActividad}`;
    console.log("ENTRO EN LA FUNCIO-------------------222222")
    return this._http.get<any>(url);
  }

}
