import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrecioActividad} from '../../models/PrecioActividad';
import {environment} from '../../../environments/environment.development';

@Injectable({providedIn: 'root'})
export class PrecioService {


  constructor(private _http: HttpClient) {}



  // getPrecioActividadById(idActividadEvento:number):Observable<PrecioActividad>{
  //
  //   let url= environment.urlPrecioActividad
  //
  // }
}
