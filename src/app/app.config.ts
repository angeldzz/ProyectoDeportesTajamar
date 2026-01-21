import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LoginInterceptor} from './core/interceptors/login.interceptor';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {httpInterceptorProviders} from './core/interceptors';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    httpInterceptorProviders,
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
};
