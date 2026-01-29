import {PartidoResultado} from './PartidoResultado';

export class ResultadoDeporteEvento {
  constructor(
      public deporte: string,
      public resultados:PartidoResultado[],
      public expandido?: boolean
  ){}

}
//
// export interface ResultadoDeporteEvento {
//   deporte: string;
//   resultados: any[];
//   expandido?: boolean; // <-- Nueva propiedad
// }
