export class ActividadDeportes{
  constructor(
    public fechaEvento: Date,
    public idActividad: number,
    public idEvento: number,
    public idEventoActividad: number,
    public idProfesor: number,
    public nombreActividad: string,
    public minimoJugadores: number
  ){}
}
