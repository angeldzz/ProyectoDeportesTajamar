export class ActividadDeportesInscrito{
    
  constructor(
    public fechaEvento: Date,
    public fechaInscripcion: Date,
    public id: number,
    public idActividad: number,
    public idEvento: number,
    public idEventoActividad: number,
    public idUsuario: number,
    public nombreActividad: string,
    public quiereSerCapitan: boolean
  ){}
}
