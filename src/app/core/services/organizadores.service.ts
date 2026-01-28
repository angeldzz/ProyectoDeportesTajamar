import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';

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

}
