import { Observable } from "rxjs";
import { IUseCase } from "../base/use-case.base";
import { IAdminModel } from "../domain/admin.model";
import { AdminRepository } from "../repositories/admin.repository";
export class LoginWithFormUseCase
  implements IUseCase<{ phoneNumber: string; password: string }, IAdminModel>
{
  constructor(private adminRepository: AdminRepository) {}
  execute(params: {
    phoneNumber: string;
    password: string;
  }): Observable<IAdminModel> {
    return this.adminRepository.login(params.phoneNumber, params.password);
  }
}
