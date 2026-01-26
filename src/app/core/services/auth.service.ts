import {Injectable, inject, signal} from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private _http: HttpClient) {}

  private router = inject(Router);
  private readonly ACCESS_TOKEN = 'accessToken';
  private jwtHelper: JwtHelperService = new JwtHelperService();

  loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  nombreSubject = new BehaviorSubject<string | null>(localStorage.getItem('usuario'));
  roleSubject = new BehaviorSubject<number | null>(this.getUserRole());

  public nombreUsuario$: Observable<string | null> = this.nombreSubject.asObservable();
  public userRole$: Observable<number | null> = this.roleSubject.asObservable();

  get isLoggedInUser(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(userName:string, password:string):Observable<any> {

    let url=environment.url+"api/Auth/LoginEventos"

    const body= {
      "userName":userName,
      "password":password
    }
    return this._http.post(url, body)
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN);
  }
  storeNombre(nombre:string):void {
    localStorage.setItem("usuario",nombre);
    this.nombreSubject.next(nombre);
  }

  storeToken(token:string){
    localStorage.setItem(this.ACCESS_TOKEN, token)
    this.loggedIn.next(true); // ← AGREGAR ESTA LÍNEA
  }

  //** TEMPORAL ** //
  storeRole(role:string){
    localStorage.setItem("role", role);
    this.roleSubject.next(this.getUserRole()); // Actualizar el observable
  }
  //** ----- ** //

  getUserRole(): number | null {
    const accessToken: string |null = this.getToken();

    if (!accessToken) {
      return null;
    }
    const userRoleId:string |null  = localStorage.getItem("role");

    switch (userRoleId) {
      case "1":
        return 1;  //PROFESOR
      case "2":
        return 2; //ALUMNO
      case "3":
        return 3; //ADMINISTRADOR
      case "4":
        return 4; //ORGANIZADOR
      case "5":
        return 5; //CAPITAN
      default:
        return null;
    }
  }
    logout() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");

    this.nombreSubject.next(null);
    this.roleSubject.next(null);
    this.loggedIn.next(false); // Avisamos que ya no tiene token
    this.router.navigate(['/login']); // Redirección automática
  }

  getToken(): string | null{
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

}
