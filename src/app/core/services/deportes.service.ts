import { Injectable } from '@angular/core';
import {Deporte} from '../../models/Deportes';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {ActividadDeportes} from '../../models/ActividadDeportes';

@Injectable({ providedIn: 'root' })
export class DeportesService {

  constructor(private _http: HttpClient) {}

    getDeportesEvento(idEvento:number):Observable<Array<ActividadDeportes>> {
    let url=environment.urlActividades+"ActividadesEvento/"+idEvento;
    return this._http.get<Array<ActividadDeportes>>(url);
    }

    getActividades():Observable<Array<Deporte>>{
    let url=environment.urlActividades;
    return this._http.get<Array<Deporte>>(url);
    }

    getDeportes():Observable<Array<Deporte>>{
      let url=environment.urlActividades;
      return this._http.get<Array<Deporte>>(url);
      }


    crearActividad(nombre:String,minJugadores:Number):Observable<any> {
      let url=environment.urlActividades+"create";

      const body={
        "idActividad": 0,
        "nombre":nombre,
        "minimoJugadores": minJugadores
      }
      return this._http.post(url, body);
    }

};
