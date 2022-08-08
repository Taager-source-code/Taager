import { UserRepository } from '@core/repositories/user.repository';
import { UseCase } from '@core/base/use-case';
import { UserModel } from '@core/domain/user.model';
import { Observable } from 'rxjs';
export class UserLoginUseCase implements UseCase<{ usernameOrPhoneNumber: string; password: string }, UserModel> {
    constructor(private userRepository: UserRepository) { }
    execute(
        { usernameOrPhoneNumber, password }:
        { usernameOrPhoneNumber: string; password: string },
    ): Observable<UserModel> {
        return this.userRepository.login(usernameOrPhoneNumber, password);
    }
}
