import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Evento} from "../../models/Evento";
import {environment} from "../../../environments/environment.development";
import { Deporte } from "../../models/Deportes";

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor(private _http: HttpClient) {
  }

  GetEventos(): Observable<Array<Evento>> {
    return this._http.get<Array<Evento>>(environment.urlEventos);
  }
  GetEventoIndividual(id: number): Observable<Evento>{
    return this._http.get<Evento>(environment.urlEventos + "/" + id);
  }
  createEvento(fecha: Date): Observable<Evento> {
      console.log(fecha);
    const fechaFormateada = encodeURIComponent(fecha.toISOString());
    return this._http.post<Evento>(environment.urlEventos + "create/" + fechaFormateada, null);
  }
  findActividadEvento(idEvento:String,idActividad:String):Observable<any>{
    let url=environment.urlActividadesEventos+"FindIdEventoActividad/"+idEvento+"/"+idActividad;

    return this._http.get(url);
  }
  AsignarActividad_Evento(idEvento: number, idActividad: number): Observable<any> {
    return this._http.post<any>(
      `${environment.urlActividadesEventos}create/${idEvento}/${idActividad}`,
      null
    );
  }

  EliminarActividad_Evento(idEventoActividad: number): Observable<any> {
    return this._http.delete<any>(
      `${environment.urlActividadesEventos}${idEventoActividad}`
    );
  }
}
