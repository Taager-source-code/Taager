import { UserRepository } from '@core/repositories/user.repository';
import { UseCase } from '@core/base/use-case';
import { UserModel } from '@core/domain/user.model';
import { Observable } from 'rxjs';
export class GetUserByTaagerIdUseCase implements UseCase<string, UserModel> {
  constructor(private userRepository: UserRepository) { }
  execute(taagerId: string): Observable<UserModel> {
    return this.userRepository.getUserByTaagerId(taagerId);
  }
}
