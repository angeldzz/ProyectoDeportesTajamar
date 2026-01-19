import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PartidoResultado} from '../../models/PartidoResultado';
import {environment} from '../../../environments/environment.development';

@Injectable({providedIn: 'root'})
export class ResultadoService {


  constructor(private _http: HttpClient) {
  }


  getResultados(): Observable<Array<PartidoResultado>> {

    let url = environment.urlResultados;

    return this._http.get<Array<PartidoResultado>>(url);
  }


  getResultadosByActividadEvento(idEventoActividad:String): Observable<Array<PartidoResultado>> {

    let url = environment.urlResultados+"PartidosResultadosActividad/"+idEventoActividad;
    return this._http.get<Array<PartidoResultado>>(url);
  }

}
