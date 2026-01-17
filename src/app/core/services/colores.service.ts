import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Colores} from '../../models/Colores';
import {environment} from '../../../environments/environment.development';
import {Deporte} from '../../models/Deportes';

@Injectable({providedIn: 'root'})
export class ColoresService {

  constructor(private _http: HttpClient) { }


  getColores():Observable<Array<Colores>> {

    let url = environment.urlColores;
    return this._http.get<Array<Colores>>(url);
  }

  getVariableColor(nombre: string): string {
    if (!nombre) return 'var(--color-default)';

    // Pasamos a minúsculas y quitamos espacios para evitar errores
    const clave = nombre.toLowerCase().trim();

    // Retornamos la variable CSS correspondiente
    // Esto asume que si el back devuelve "Rojo", tú tienes "--color-rojo"
    return `var(--color-${clave}, var(--color-default))`;
  }

  deleteColor(idColor:Number):Observable<any> {
    let url = environment.urlColores+idColor;

    return this._http.delete(url);
  }

}
