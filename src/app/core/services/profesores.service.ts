import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';
import {Usuario} from '../../models/Usuario';

@Injectable({providedIn: 'root'})
export class ProfesoresService {
  constructor(private _http: HttpClient) {}


  getProfesActivos():Observable<Array<Usuario>>{
    let url=environment.urlProfesEventos+"ProfesActivos";
      return this._http.get<Array<Usuario>>(url)
  }
  asociarProfesorEvento(idEvento:number,idProfesor:number){

    let url=environment.urlProfesEventos+"AsociarProfesorEvento/"+idEvento+"/"+idProfesor;

    const body={}
    return this._http.post(url,body)
  }

}
