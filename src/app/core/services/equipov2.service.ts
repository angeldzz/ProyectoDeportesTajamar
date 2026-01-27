import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {Equipov2} from '../../models/EquipoV2';
import {Usuario} from '../../models/Usuario';
import {MiembroEquipo, MiembroEquipoData} from '../../models/MiembroEquipoData';

@Injectable({providedIn: 'root'})
export class Equipov2Service {


  constructor(private _http: HttpClient) {
  }


  getEquiposEvento(idEvento: number): Observable<any[]> {

    let url = environment.urlEquipos + "EquiposEvento/" + idEvento
    return this._http.get<any[]>(url);
  }
//TODO CAMBIAR EL OBJETO QUE DEVUELVE POR MiembroEquipoData
  getMiembrosEquipoById(idEquipo:number):Observable<Array<Usuario>>{
    let url = environment.urlEquipos+"UsuariosEquipo/"+idEquipo

    return this._http.get<Array<Usuario>>(url);
  }

  getJugadoresEquipoById(idEquipo:number):Observable<Array<MiembroEquipoData>>{
    let url = environment.urlEquipos+"UsuariosEquipo/"+idEquipo

    return this._http.get<Array<MiembroEquipoData>>(url);
  }

  getEquipoById(idEquipo:number):Observable<Equipov2>{
    let url= environment.urlEquipos+idEquipo;

    return this._http.get<Equipov2>(url);
  }

  getEquiposConJugadores(idActividad: number, idEvento: number):Observable<Equipov2[]> {

    return this._http
      .get<Equipov2[]>(
        environment.urlEquipos + 'EquiposActividadEvento/' + idActividad + '/' + idEvento
      )
      .pipe(
        switchMap(equipos => {
          const peticiones = equipos.map(equipo =>
            this._http
              .get<MiembroEquipoData[]>(
                environment.urlEquipos + 'UsuariosEquipo/' + equipo.idEquipo
              )
              .pipe(
                map(miembros => ({
                  ...equipo,
                  jugadores: miembros?? []
                }))
              )
          );

          return forkJoin(peticiones);
        })
      );
  }


  obtenerMiembroEspecifico(idUsuario: number, idEquipo: number): Observable<any> {
    return this.getMiembrosEquipos().pipe(
      map(miembros => miembros.find(
        (m: { idEquipo: number; idUsuario: number; idMiembroEquipo: number }) =>
          m.idEquipo === idEquipo && m.idUsuario === idUsuario
      ))
    );
  }

  puedeUnirse(idEquipo: number, idUsuario: number): Observable<boolean> {
    let url= environment.urlEquipos+"UsuariosEquipo/" + idEquipo

    return this._http.get<any[]>(url).pipe(
      // Si NO encuentra al usuario, devuelve true (puede unirse)
      map(usuarios => !usuarios.some(u => u.idUsuario === idUsuario))
    );
  }
  getMiembrosEquipos():Observable<any>{
    let url=environment.urlMiembroEquipos
    return this._http.get(url)
  }
  unirseEquipo(idUsuario: number, idEquipo:number) {

    let url=environment.urlUsuariosDeportes+"ApuntarmeEquipo/"+idEquipo

    const body={};
    return this._http.post(url,body)
  }
  borrarMiembroEquipo(idMiembroEquipo:number):Observable<any>{
    let url=environment.urlMiembroEquipos+idMiembroEquipo
    return this._http.delete(url)
  }


  borrarEquipo(){

  }

  getEquiposByEventoActividad(idActividad:number,idEvento:number):Observable<Array<Equipov2>>{
    let url= environment.urlEquipos+"EquiposActividadEvento/"+idActividad+"/"+idEvento;
    return this._http.get<Array<Equipov2>>(url);
  }



}
