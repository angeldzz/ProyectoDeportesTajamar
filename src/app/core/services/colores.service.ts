import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Colores} from '../../models/Colores';
import {environment} from '../../../environments/environment.development';
import {Deporte} from '../../models/Deportes';

@Injectable({providedIn: 'root'})
export class ColoresService {

  constructor(private _http: HttpClient) { }


  getColores():Observable<Array<Colores>> {

    let url = environment.urlColores;
    return this._http.get<Array<Colores>>(url);
  }

  updateColor(idColor: Number,nombreColor:String):Observable<any> {
    let url= environment.urlColores+"update";
    const body={
      "idColor": idColor,
      "nombreColor": nombreColor
    }
    return this._http.put(url,body)
  }
  createColor(nombreColor:String):Observable<any> {
    let url= environment.urlColores+"create/"+nombreColor;
    return this._http.post(url,nombreColor)
  }

  deleteColor(idColor:Number):Observable<any> {
    let url = environment.urlColores+idColor;

    return this._http.delete(url);
  }

}
