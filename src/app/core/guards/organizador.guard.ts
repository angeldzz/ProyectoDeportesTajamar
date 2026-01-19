import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const organizadorGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = authService.getUserRole();
  const token = localStorage.getItem('accessToken');

  console.log("Guard revisando:", { role, hasToken: !!token });

  if (token && role === 4) {
    return true;
  }

  alert("No eres organizador");
  router.navigate(['']);
  return false;
};
