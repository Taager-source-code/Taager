import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../../services/localStorage.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { onUserLogout } from '../utils/functions';
import { MyToastService } from '../utils/myToast.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private toast: MyToastService,
    ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(this.localStorageService.tokenKey);
    request = request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
          if(err instanceof HttpErrorResponse) {
              if(err.status === 401) {
                  onUserLogout();
                  this.toast.showToast('Error', 'Token is not found or expired', 'error');
              }
          }
          return throwError(err);
      }),
    );
  }
}
