export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  estadoUsuario: boolean;
  imagen: string;
  idRole: number;
  role: string;
  idCurso: number;
  curso: string;
  idCursoUsuario: number;
  usuario?:string;
}
//
// export interface UsuarioData{
//
//     idUsuario: number;
//     usuario: string;
//     estadoUsuario: boolean;
//     imagen: string;
//     email: string;
//     idRole: number;
//     role: string;
//     idCurso: number;
//     curso: string;
//     fechaInicioCurso: string;
//     fechaFinCurso: string;
//     idCursosUsuarios: number;
// }
