import { inject } from "@angular/core"
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import {AuthService} from '../services/auth.service';

//
// export const adminGuard = () => {
//   // const router: Router = inject(Router);
//   // const authService: AuthService = inject(AuthService);
//   // let loggedInSubscription: Subscription;
//   // let isUserLoggedIn: boolean = false;
//   // let comprobarAdmin: boolean = false;
//
//   // Sirve para comprobar si el usario logado es admin o no
//   // loggedInSubscription = authService.isLogged.subscribe(
//   // (loggedIn: boolean): void => {
//   //   isUserLoggedIn = loggedIn;
//   //   if (isUserLoggedIn) {
//   //     if (authService.getUserRole() === 'ADMINISTRATOR') {
//   //       comprobarAdmin = true;
//   //     }else{
//   //       router.navigate(['/']).then(r => { });
//   //     }
//   //   }
//   // }
//   // )
// }
//   return comprobarAdmin;
// }
