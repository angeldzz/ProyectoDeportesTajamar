import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {Usuario} from '../../models/Usuario';

@Injectable({providedIn: 'root'})
export class OrganizadoresService {
  constructor(private _http: HttpClient) { }



  crearOrganizador(idUsuario:number){

  let url= environment.urlOrganizadores+"create/"+idUsuario;

  const body = {}
  return this._http.post(url,body);
  }


  borrarOrganizador(idUsuario:number){
    let url= environment.urlOrganizadores+"QuitarOrganizadorEvento/"+idUsuario;

    return this._http.delete(url);
  }


  getOrganizadores():Observable<Array<Usuario>>{

    let url= environment.urlOrganizadores+"OrganizadoresEvento";

    return this._http.get<Array<Usuario>>(url);
  }

}
