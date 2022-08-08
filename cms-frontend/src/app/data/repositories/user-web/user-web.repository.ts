import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '@core/domain/user.model';
import { UserRepository } from '@core/repositories/user.repository';
import { UserWebRepositoryMapper } from './mappers/user-web-repository-mapper';
import { UserApisService } from './user-apis.service';
@Injectable({
    providedIn: 'root',
})
export class UserWebRepository extends UserRepository {
    mapper = new UserWebRepositoryMapper();
    constructor(
        private http: HttpClient,
        private userApisService: UserApisService,
    ) {
        super();
    }
    login(username: string, password: string): Observable<UserModel> {
        throw new Error('Method not implemented.');
    }
    register(): Observable<UserModel> {
        throw new Error('Method not implemented.');
    }
    getUser(objectId: string): Observable<UserModel> {
        return this.userApisService.getUser(objectId).pipe(map(this.mapper.mapFrom));
    }
    getUserByTaagerId(taagerId: string): Observable<UserModel> {
        return this.userApisService.getUserByTaagerId(taagerId).pipe(map(this.mapper.mapFrom));
    }
}
