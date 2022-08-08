import { Observable } from 'rxjs';
import { UserModel } from '@core/domain/user.model';
export abstract class UserRepository {
    abstract login(usernameOrPhoneNumber: string, password: string): Observable<UserModel>;
    abstract register(): Observable<UserModel>;
    abstract getUser(objectId: string): Observable<UserModel>;
    abstract getUserByTaagerId(taagerId: string): Observable<UserModel>;
}
