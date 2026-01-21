import {Equipov2} from './EquipoV2';

//
// export class PartidoResultado {
//   constructor(
//     public idPartidoResultado: number,
//     public idEventoActividad: number,
//     public idEquipoLocal: number,
//     public idEquipoVisitante: number,
//     public puntosLocal: number,
//     public puntosVisitante: number,
//
//     public infoLocal?: Equipov2,
//     public infoVisitante?: Equipov2
//   ){}
// }
//

export interface PartidoResultado {

  idPartidoResultado: number,
  idEventoActividad: number,
  idEquipoLocal: number,
  idEquipoVisitante: number,
  puntosLocal: number,
  puntosVisitante: number,

  infoLocal?: Equipov2,
  infoVisitante?: Equipov2

  colorLocalCss?: string;
  colorVisitanteCss?: string;
}
