import { inject } from "@angular/core"
import { Router } from "@angular/router"

export const loginGuard = () => {
  const router: Router = inject(Router);
  if ((localStorage.getItem("accessToken"))){
    return true;
  }else{
    router.navigate(["/login"])
      .then(() => {})
      .catch((err) => {});
    return false;
  }
}

