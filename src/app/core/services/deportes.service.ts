import { Injectable } from '@angular/core';
import {Deporte} from '../../models/Deportes';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {ActividadDeportes} from '../../models/ActividadDeportes';

@Injectable({ providedIn: 'root' })
export class DeportesService {

  constructor(private _http: HttpClient) {}
  getDeportes():Observable<Array<Deporte>> {

    let url=environment.urlActividades;
    return this._http.get<Array<Deporte>>(url);

    }
    getDeportesEvento(idEvento:number):Observable<Array<ActividadDeportes>> {

    let url=environment.urlActividades+"ActividadesEvento/"+idEvento;
    return this._http.get<Array<ActividadDeportes>>(url);

    }

  //
  // getProductsMini() {
  //   return Promise.resolve(this.getDeportes().slice(0, 5));
  // }
  //
  // getProductsSmall() {
  //   return Promise.resolve(this.getDeportes().slice(0, 10));
  // }
  //
  // getProducts() {
  //   return Promise.resolve(this.getDeportes());
  // }
};
