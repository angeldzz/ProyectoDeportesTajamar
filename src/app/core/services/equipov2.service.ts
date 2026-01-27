import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, forkJoin, map, Observable, switchMap} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {Equipov2} from '../../models/EquipoV2';
import {Usuario} from '../../models/Usuario';
import {MiembroEquipo, MiembroEquipoData} from '../../models/MiembroEquipoData';
import {ColoresService} from './colores.service';
import {Colores} from '../../models/Colores';

@Injectable({providedIn: 'root'})
export class Equipov2Service {


  constructor(private _http: HttpClient,
              private _coloresService:ColoresService,) {
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

  // getEquiposConJugadores(idActividad: number, idEvento: number):Observable<Equipov2[]> {
  //
  //   return this._http
  //     .get<Equipov2[]>(
  //       environment.urlEquipos + 'EquiposActividadEvento/' + idActividad + '/' + idEvento
  //     )
  //     .pipe(
  //       switchMap(equipos => {
  //         const peticiones = equipos.map(equipo =>
  //           this._http
  //             .get<MiembroEquipoData[]>(
  //               environment.urlEquipos + 'UsuariosEquipo/' + equipo.idEquipo
  //             )
  //             .pipe(
  //               map(miembros => ({
  //                 ...equipo,
  //                 jugadores: miembros?? []
  //               }))
  //             )
  //         );
  //
  //         return forkJoin(peticiones);
  //       })
  //     );
  // }
  getEquiposConJugadores(idActividad: number, idEvento: number): Observable<Equipov2[]> {
    return this._http
      .get<Equipov2[]>(
        environment.urlEquipos + 'EquiposActividadEvento/' + idActividad + '/' + idEvento
      )
      .pipe(
        switchMap(equipos => {
          // Obtenemos los colores
          return this._http.get<Colores[]>(environment.urlColores).pipe(
            switchMap(colores => {
              const peticiones = equipos.map(equipo =>
                this._http
                  .get<MiembroEquipoData[]>(
                    environment.urlEquipos + 'UsuariosEquipo/' + equipo.idEquipo
                  )
                  .pipe(
                    map(miembros => ({
                      ...equipo,
                      jugadores: miembros ?? [],
                      infoColor: colores.find(color => color.idColor === equipo.idColor)
                    }))
                  )
              );

              return forkJoin(peticiones);
            })
          );
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


  crearEquipo(idEventoActividad:number,nombreEquipo:string,minJugadores:number,idColor:number,idCurso:number){

    let url=environment.urlEquipos+"Create"
   const body= {
      "idEquipo": 0,
      "idEventoActividad": idEventoActividad,
      "nombreEquipo": nombreEquipo,
      "minimoJugadores": minJugadores,
      "idColor": idColor,
      "idCurso": idCurso
    }
    console.log(body)
    return this._http.post(url,body)
  }
  borrarEquipo(idEquipo:number){
    let url= environment.urlEquipos+idEquipo
    return this._http.delete(url)
  }

  getEquiposByEventoActividad(idActividad:number,idEvento:number):Observable<Array<Equipov2>>{
    let url= environment.urlEquipos+"EquiposActividadEvento/"+idActividad+"/"+idEvento;
    return this._http.get<Array<Equipov2>>(url);
  }

  colores: any[] = []; // Array completo de colores
  coloresDisponibles: any[] = []; // Array de colores disponibles
  obtenerColoresDisponibles(idActividad: number, idEvento: number): Observable<any[]> {
    return this._http.get<any[]>(environment.urlColores).pipe(
      switchMap(todosLosColores =>
        this._http.get<any[]>(environment.urlEquipos + "EquiposActividadEvento/" + idActividad + "/" + idEvento).pipe(
          map(equiposExistentes => {
            const coloresUsados = equiposExistentes.map(equipo => equipo.idColor);
            return todosLosColores.filter(color => !coloresUsados.includes(color.idColor));
          })
        )
      )
    );
  }
  obtenerEquipoConColor(idActividad: number, idEvento: number): Observable<Equipov2[]> {
    return this._http.get<Equipov2[]>(
      environment.urlEquipos + "EquiposActividadEvento/" + idActividad + "/" + idEvento
    ).pipe(
      switchMap(equipos =>
        this._http.get<Colores[]>(environment.urlColores).pipe(
          map(colores => {
            // Agregamos la info del color a cada equipo
            return equipos.map(equipo => ({
              ...equipo,
              infoColor: colores.find(color => color.idColor === equipo.idColor)
            }));
          })
        )
      )
    );
  }



}
