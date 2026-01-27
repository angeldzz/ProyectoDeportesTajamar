import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable} from 'rxjs';
import {PartidoResultado} from '../../models/PartidoResultado';
import {environment} from '../../../environments/environment.development';
import {Equipov2Service} from './equipov2.service';
import {Equipov2} from '../../models/EquipoV2';
import {ColoresService} from './colores.service';
import {Colores} from '../../models/Colores';

@Injectable({providedIn: 'root'})
export class ResultadoService {


  constructor(private _http: HttpClient,
              private _equiposService: Equipov2Service,
              private _coloresService: ColoresService,) {
  }


  getResultados(): Observable<Array<PartidoResultado>> {

    let url = environment.urlResultados;

    return this._http.get<Array<PartidoResultado>>(url);
  }


  getResultadosByActividadEvento(idEventoActividad:String): Observable<Array<PartidoResultado>> {

    let url = environment.urlResultados+"PartidosResultadosActividad/"+idEventoActividad;
    return this._http.get<Array<PartidoResultado>>(url);
  }


  getResultadosWithEquipos(idEvento?: number): Observable<Array<PartidoResultado>> {
    const urlResultados = environment.urlResultados;
    const id = idEvento || 2;

    const reqResultados = this._http.get<Array<PartidoResultado>>(urlResultados);
    const reqEquipos = this._equiposService.getEquiposEvento(id);
    const reqColores = this._coloresService.getColores(); // <--- NUEVA PETICIÓN

    return forkJoin([reqResultados, reqEquipos, reqColores]).pipe(
      map(([partidos, equipos, colores]) => {

        //Mapa de Colores (ID -> Objeto Color)
        const mapaColores = new Map<number, Colores>();
        colores.forEach(c => mapaColores.set(c.idColor, c));

        //Mapa de Equipos (ID -> Objeto Equipo ENRIQUECIDO)
        const mapaEquipos = new Map<number, Equipov2>();

        equipos.forEach(eq => {
          //cruzamos Equipo con Color
          eq.infoColor = mapaColores.get(eq.idColor);

          mapaEquipos.set(eq.idEquipo, eq);
        });

        partidos.forEach(partido => {
          partido.infoLocal = mapaEquipos.get(partido.idEquipoLocal);
          partido.infoVisitante = mapaEquipos.get(partido.idEquipoVisitante);
        });

        return partidos;
      })
    );
  }


  crearResultado(idEventoActividad:number,
                 idEquipoLocal:number,
                 idEquipoVisitante:number,
                 puntosLocal:number,
                 puntosVisitante:number):Observable<any> {

    let url= environment.urlResultados;

   const body= {
      "idPartidoResultado": 0,
      "idEventoActividad": idEventoActividad,
      "idEquipoLocal": idEquipoLocal,
      "idEquipoVisitante": idEquipoVisitante,
      "puntosLocal": puntosLocal,
      "puntosVisitante": puntosVisitante
    }
    return this._http.post(url, body);
  }
}
