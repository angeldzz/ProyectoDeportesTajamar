import {PartidoResultado} from './PartidoResultado';

export class ResultadoDeporteEvento {
  constructor(
      public deporte: string,
      public resultados:PartidoResultado[]
  ){}

}
