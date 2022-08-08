import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ISAuthenticatedService } from "../../Services/isAuth.service";
import { ToastrService } from "ngx-toastr";
import { onUserLogout } from "../../shared/utilities/functions";
/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private isAuth: ISAuthenticatedService,
    private router: Router,
    private toastService: ToastrService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const token = this.isAuth.getToken();
    req = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    return next.handle(req).pipe(
      catchError(async (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          this.toastService.error(
            err?.error?.msg || err?.message || "An error occurred",
            `Error code ${err?.status || "unknown"}`
          );
          if (err.status === 401) {
            if (!(this.router.url === "/" || this.router.url === "/register")) {
              onUserLogout();
            }
          }
        }
        return throwError(err);
      })
    );
  }
}
