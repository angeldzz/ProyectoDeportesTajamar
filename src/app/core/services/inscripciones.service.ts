import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../../models/Evento";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})



export class InscripcionesService {
  constructor(private _http: HttpClient) {}
}
