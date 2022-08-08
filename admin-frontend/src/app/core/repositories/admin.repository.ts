import { Observable } from "rxjs";
import { IAdminModel } from "../domain/admin.model";
export abstract class AdminRepository {
  abstract login(
    phoneNumber: string,
    password: string
  ): Observable<IAdminModel>;
  abstract logout(): Observable<any>;
}
