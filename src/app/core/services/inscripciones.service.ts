import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../../models/Evento";
import { environment } from "../../../environments/environment.development";
import {Inscripciones} from '../../models/Inscripciones';
@Injectable({
  providedIn: 'root'
})



export class InscripcionesService {
  constructor(private _http: HttpClient) {}


  inscribirseActividadEvento(idUser:number,idEventoActividad:number,capitan:boolean,fecha:Date):Observable<Inscripciones>{

    let url= environment.urlInscripciones+"create";

    const body={
      "idInscripcion": 0,
      "idUsuario": idUser,
      "idEventoActividad": idEventoActividad,
      "quiereSerCapitan": capitan,
      "fechaInscripcion": fecha
    }

    return this._http.post<Inscripciones>(url, body);
  }


  getNumeroInscipcionesEventoActividad(idEvento:number, idactividad:number):Observable<any>{
    let url = environment.urlInscripciones+"InscripcionesUsuariosEventoActividad/"+idEvento+"?idactividad="+idactividad;

    return this._http.get(url);
  }
}
