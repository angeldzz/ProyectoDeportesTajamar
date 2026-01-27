import {Colores} from './Colores';
import {MiembroEquipoData} from './MiembroEquipoData';
//
// export class Equipov2 {
//   constructor(
//     public idEquipo: number,
//     public idEventoActividad: number,
//     public nombreEquipo: string,
//     public minimoJugadores: number,
//     public idColor: number,
//     public idCurso: number,
//     //public jugadores?: MiembroEquipoData[],
//     public jugadores: MiembroEquipoData[] = [],
//     public infoColor?: Colores
//   ) { }
// }
//

export interface Equipov2 {
  idEquipo: number;
  idEventoActividad: number;
  nombreEquipo: string;
  minimoJugadores: number;
  idColor: number;
  idCurso: number;
  jugadores: MiembroEquipoData[];
  infoColor?: Colores;
}
