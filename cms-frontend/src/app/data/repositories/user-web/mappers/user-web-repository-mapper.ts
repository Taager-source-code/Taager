import { Mapper } from '@core/base/mapper';
import { UserModel } from '@core/domain/user.model';
import { UserEntity } from '../entities/user-web-entity';
export class UserWebRepositoryMapper extends Mapper <UserEntity, UserModel> {
    mapFrom(param: UserEntity): UserModel {
        return param;
    }
    mapTo(param: UserModel): UserEntity {
        return param;
    }
}
