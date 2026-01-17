import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Usuario} from '../../models/Usuario';

@Injectable({providedIn: 'root'})
export class UserService {


  constructor(private _http: HttpClient) {}


  // getUserData():Observable<Usuario>{
  //
  //
  // }
}
