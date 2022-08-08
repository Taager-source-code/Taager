import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { ISAuthenticatedService } from "../Services/isAuth.service";
@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private isAuth: ISAuthenticatedService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isAuth.checkAuth()) {
      return true;
    }
    const queryString = next.queryParams;
    // navigate to login page
    this.router.navigate(["/admin"], { queryParams: queryString });
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
}
