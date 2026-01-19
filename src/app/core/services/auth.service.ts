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

  // getUserRole(): string | null {
  //   return localStorage.getItem('role');
  // }


  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN);
  }

  storeToken(token:string){
    localStorage.setItem(this.ACCESS_TOKEN, token)
    this.loggedIn.next(true); // ← AGREGAR ESTA LÍNEA
  }




  //** TEMPORAL ** //
  storeRole(role:string){
    localStorage.setItem("role", role)
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
        return 1;
      case "2":
        return 2;
      case "3":
        return 3;
      case "4":
        return 4;
      case "5":
        return 5;
      default:
        return null;
    }
  }

    logout() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem("role");
    this.loggedIn.next(false); // Avisamos que ya no tiene token
    this.router.navigate(['/login']); // Redirección automática
  }

  getToken(): string | null{
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

}
