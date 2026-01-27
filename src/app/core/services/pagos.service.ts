import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Pagos } from "../../models/Pagos";
@Injectable({
  providedIn: 'root'
})

export class PagosService {
  constructor(private _http: HttpClient) {}
    GetPagos(): Observable<Array<Pagos>>{
      return this._http.get<Array<Pagos>>(environment.urlPagos);
    }
    UpdatePagos(pago: Pagos): Observable<Pagos> {
      console.log(pago);
      return this._http.put<Pagos>(`${environment.urlPagos}update`, pago);
    }
}
