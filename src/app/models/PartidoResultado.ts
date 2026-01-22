import {Equipov2} from './EquipoV2';

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
