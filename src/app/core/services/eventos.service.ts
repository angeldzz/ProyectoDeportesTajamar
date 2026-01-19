import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Evento} from "../../models/Evento";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor(private _http: HttpClient) {
  }

  GetEventos(): Observable<Array<Evento>> {
    return this._http.get<Array<Evento>>(environment.urlEventos);
  }

  findActividadEvento(idEvento:String,idActividad:String):Observable<any>{
    let url=environment.urlEventos+"FindIdEventoActividad/"+idEvento+"/"+idActividad;

    return this._http.get(url);
  }
}
