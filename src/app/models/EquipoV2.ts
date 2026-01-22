import {Colores} from './Colores';

export class Equipov2 {
  constructor(
    public idEquipo: number,
    public idEventoActividad: number,
    public nombreEquipo: string,
    public minimoJugadores: number,
    public idColor: number,
    public idCurso: number,
    public infoColor?: Colores
  ) { }
}

