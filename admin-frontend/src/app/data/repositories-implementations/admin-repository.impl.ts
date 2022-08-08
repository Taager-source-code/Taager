import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { IAdminModel } from "src/app/core/domain/admin.model";
import { AdminRepository } from "src/app/core/repositories/admin.repository";
import { AuthService } from "src/app/presentation/auth/services/auth.service";
import { ISAuthenticatedService } from "src/app/presentation/Services/isAuth.service";
@Injectable()
export class AdminRepositoryImplementation extends AdminRepository {
  constructor(
    private authService: AuthService,
    private isAuthenticatedService: ISAuthenticatedService
  ) {
    super();
  }
  login(phoneNumber: string, password: string): Observable<IAdminModel> {
    return this.authService.login({ phoneNumber, password });
  }
  logout(): Observable<boolean | Error> {
    try {
      this.isAuthenticatedService.logout();
      return of(true);
    } catch (err) {
      throwError({ err: { msg: "Error occurred when trying to logout!" } });
    }
  }
}