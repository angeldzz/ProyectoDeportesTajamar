import {Colores} from './Colores';
import {MiembroEquipoData} from './MiembroEquipoData';


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
