import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.development';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';


@Injectable()
export class AuthService {

  constructor(private _http: HttpClient) {}


  login(userName:string, password:string): Observable<any> {

    let url=environment.url+"api/Auth/LoginEventos"


    const body= {
      "userName":userName,
      "password":password
    }
    const headers={"Content-Type":"application/json"}

    return this._http.post(url,body,{headers:headers})
  }
}
