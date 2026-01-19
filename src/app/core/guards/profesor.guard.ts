import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const profesorGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = authService.getUserRole();
  const token = localStorage.getItem('accessToken');

  console.log("Guard revisando:", { role, hasToken: !!token });

  if (token && role === 1) {
    return true;
  }

  alert("No eres profesor");
  router.navigate(['']);
  return false;
};
