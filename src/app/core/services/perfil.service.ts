import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { PerfilUsuario } from "../../models/PerfilUsuario";

@Injectable({
    providedIn: 'root'
})
export class PerfilService{
    constructor(private _http: HttpClient) {}
    GetEventos():Observable<PerfilUsuario>{
        return this._http.get<PerfilUsuario>(environment.urlUsuariosDeportes + "Perfil");
    }
}