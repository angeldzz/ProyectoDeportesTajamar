import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {Usuario} from "../../models/Usuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient) {
  }

  getDatosUsuario(): Observable<Usuario> {
    return this._http.get<Usuario>(environment.urlUsuariosDeportes + "Perfil");
  }
}
