import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LOCALSTORAGE_TOKEN_KEY } from '@data/constants';
import { onUserLogout } from '../utils/functions';
import { ToastService } from '../utils/toast.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private toast: ToastService,
    ) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
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
                        this.toast.showToast('Error', 'Token is not found or expired');
                    }
                }
                return throwError(err);
            }),
          );
    }
}