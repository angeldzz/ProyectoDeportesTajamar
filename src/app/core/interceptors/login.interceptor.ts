import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(event => {

          if (event instanceof HttpResponse && req.url.endsWith('/login')) {
            console.log("INTERCEPT LOGIN" + event);
            const accessToken = event.body.response;

            this.authService.storeToken(accessToken);


            this.authService.loggedInUser.next(true);
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
