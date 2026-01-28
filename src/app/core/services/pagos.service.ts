import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment.development";
import { Pagos } from "../../models/Pagos";
import { PrecioActividad } from "../../models/PrecioActividad";
@Injectable({
  providedIn: 'root'
})

export class PagosService {
  constructor(private _http: HttpClient) {}
    GetPagos(): Observable<Array<Pagos>>{
      return this._http.get<Array<Pagos>>(environment.urlPagos);
    }
    CreatePagos(pago: Pagos): Observable<Pagos> {
      return this._http.post<Pagos>(environment.urlPagos + "create", pago);
    }
    UpdatePagos(pago: Pagos): Observable<Pagos> {
      console.log(pago);
      return this._http.put<Pagos>(`${environment.urlPagos}update`, pago);
    }
    DeletePagos(id: number): Observable<any> {
      return this._http.delete(`${environment.urlPagos}${id}`);
    } 
    GetPrimerPrecioActividadId(): Observable<number> {
      return this._http.get<Array<PrecioActividad>>(`${environment.urlPrecioActividad}`).pipe(
        map(precios => precios[0]?.idPrecioActividad || 0)
      );
    }
  }
