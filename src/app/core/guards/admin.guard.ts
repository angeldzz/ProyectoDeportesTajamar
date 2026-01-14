import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const adminGuard = () => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  let loggedInSubscription: Subscription;
  let isUserLoggedIn: boolean = false;
  let comprobarAdmin: boolean = false;

  loggedInSubscription = authService.isLoggedInUser.subscribe(
    (loggedIn: boolean): void => {
      isUserLoggedIn = loggedIn;

      console.log(authService.isLoggedInUser);
      if (isUserLoggedIn) {
        //TODO CAMBIAR LO HARDCODEADO
        if (authService.getUserRole() == 'ADMINISTRADOR'){
          comprobarAdmin = true;
        }else{
          alert("No eres administrador")
          router.navigate(['']).then(r => { });
        }
      }else{
        console.log(authService.isLoggedInUser);
        router.navigate(['/login']).then(r => { });
      }
    }
  )

  return comprobarAdmin;
}
