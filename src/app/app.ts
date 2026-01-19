import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './core/services/auth.service';
import { LoginInterceptor } from './core/interceptors/login.interceptor';
import { NavbarComponent } from './components/shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HttpClientModule],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true }
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProyectoDeportesTajamar');
  
  constructor(
    public authService: AuthService
  ){
  }
}

/*
  Nota de cambios realizados:
  - He registrado `HttpClientModule` y el `LoginInterceptor` correctamente (proveedor HTTP_INTERCEPTORS) para que
    los interceptores funcionen en toda la app.
  - He reemplazado llamadas directas a `fetch()` por `HttpClient` en los componentes:
      - `src/app/components/pages/equipos/equipos.ts`
      - `src/app/components/pages/eventos/eventos.ts`
      - `src/app/components/pages/rol/rol.ts`
      - `src/app/components/pages/seleccionar-deporte/seleccionar-deporte.ts`
    Esto permite que los interceptores inyecten tokens/cabeceras y facilita el testing.
  - Ahora las URLs vienen de `environment` y no están hardcodeadas, evitando problemas entre entornos.
  - No toqué las plantillas excepto añadir un comentario en `app.html`; las bindings se mantienen compatibles.

  Si algo no funciona al ejecutar, ejecuta `npm install` y luego `npm run start` y reviso los errores.
// */
// de todas formas dejo aqui el codigo antetior del applyMixins.ts para que no haya problemas

// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import {HttpClient} from '@angular/common/http';
// import {AuthService} from './core/services/auth.service';
// import {LoginInterceptor} from './core/interceptors/login.interceptor';
// import { NavbarComponent } from './components/shared/navbar/navbar.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet,NavbarComponent],
//   providers: [HttpClient,AuthService,LoginInterceptor],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('ProyectoDeportesTajamar');
  
//   constructor(
//     public authService: AuthService
//   ){
//   }
// }
