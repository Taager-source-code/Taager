import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { ISAuthenticatedService } from "../Services/isAuth.service";
import { onUserLogout } from "../shared/utilities/functions";
@Injectable()
export class AuthAppGuard implements CanActivate {
  constructor(private isAuth: ISAuthenticatedService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check first if user is already authenticated and redirect to admin.
    if (this.isAuth.checkAuth()) {
      const queryString = route.queryParams;
      this.router.navigate(["/admin"], { queryParams: queryString });
      return false;
    }
    onUserLogout();
    return false;
  }
}
