import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URLS } from '@data/constants';
import { UserEntity } from './entities/user-web-entity';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserApisService {
  constructor(private http: HttpClient) { }
  getUser(objectId: string): Observable<UserEntity> {
    return this.http.get<{data: UserEntity}>(API_URLS.GET_USER_URL(objectId)).pipe(map(({data}) => data));
  }
  getUserByTaagerId(taagerId: string): Observable<UserEntity> {
    return this.http.get<{data: UserEntity}>(API_URLS.GET_USER_BY_TAAGER_ID(taagerId)).pipe(map(({data}) => data));
  }
}
