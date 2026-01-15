import {map, take} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('accessToken');

  console.log("Guard revisando:", { role, hasToken: !!token });

  if (token && role === 'ADMINISTRADOR') {
    return true;
  }

  alert("No eres administrador");
  router.navigate(['']);
  return false;
};
