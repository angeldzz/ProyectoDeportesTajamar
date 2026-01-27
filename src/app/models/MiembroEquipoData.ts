export class MiembroEquipoData {

  constructor(
  public id:number,
  public idUsuario:number,
  public usuario:string,
  public imagen:string,
  public role:string,
  public idCurso:number,
  public curso:string,
  public idMiembroEquipo:number,
  public idEquipo:number

  ){}
}

export interface MiembroEquipo {
  idMiembroEquipo: number;
  idEquipo: number;
  idUsuario: number;
}
