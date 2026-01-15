export class Materiales {
  constructor(
    public idMaterial: number,
    public idEventoActividad: number,
    public idUsuario: number,
    public nombreMaterial: string,
    public pendiente: Boolean,
    public fechaSolicitud: Date
  ){}
}
