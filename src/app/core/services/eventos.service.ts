import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../../models/Evento";
import { environment } from "../../../environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class EventosService{
    constructor(private _http: HttpClient) {}
    GetEventos():Observable<Array<Evento>>{
        return this._http.get<Array<Evento>>(environment.urlEventos);
    }
}