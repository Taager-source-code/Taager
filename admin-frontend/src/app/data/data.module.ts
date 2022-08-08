import { NgModule } from "@angular/core";
import { AdminRepository } from "../core/repositories/admin.repository";
import { LoginWithFormUseCase } from "../core/usecases/login-with-form.usecase";
import { AdminRepositoryImplementation } from "./repositories-implementations/auth/admin-repository.impl";
const loginWithFormUseCaseFactory = (adminRepository: AdminRepository) =>
  new LoginWithFormUseCase(adminRepository);
const loginWithFormUseCaseProvider = {
  provide: LoginWithFormUseCase,
  useFactory: loginWithFormUseCaseFactory,
  deps: [AdminRepository],
};
@NgModule({
  providers: [
    { provide: AdminRepository, useClass: AdminRepositoryImplementation },
    loginWithFormUseCaseProvider,
  ],
})
export class DataModule {}
