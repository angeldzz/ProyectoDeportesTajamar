import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { Materiales } from "../../models/Materiales";

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  constructor(private _http: HttpClient) { }

  getAll(): Observable<Materiales[]> {
    return this._http.get<Materiales[]>(environment.urlMateriales);
  }

  getById(id: number): Observable<Materiales> {
    return this._http.get<Materiales>(environment.urlMateriales + id);
  }

  create(item: Partial<Materiales>): Observable<any> {
    // API expects POST to /api/Materiales/create
    return this._http.post(environment.urlMateriales + 'create', item);
  }

  update(id: number, item: Partial<Materiales>): Observable<any> {
    // API expects PUT to /api/Materiales/update
    return this._http.put(environment.urlMateriales + 'update', item);
  }

  delete(id: number): Observable<any> {
    return this._http.delete(environment.urlMateriales + id);
  }
}
