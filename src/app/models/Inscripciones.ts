export class Inscripciones {
  constructor(
    public idInscripcion: number,
    public idUsuario: number,
    public idEventoActividad: number,
    public quiereSerCapitan: Boolean,
    public fechaInscripcion: Date
  ){}
}
