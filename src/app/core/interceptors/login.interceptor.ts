import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('1. Petición interceptada hacia:', req.url);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('2. Respuesta recibida con estado:', event.status);

            if (req.url.includes('/login')) {
              console.log('3. ¡ENTRÓ AL LOGIN! Datos:', event.body);

              const accessToken = event.body?.response;
              if (accessToken) {
                this.authService.storeToken(accessToken);
                this.authService.storeRole(event.body?.role);
                this.authService.loggedIn.next(true);
              }
            }
          }
        },
        error: (err) => {
          console.error('Error detectado en el interceptor:', err.status, err.message);
        }
      })
    );
  }
}
