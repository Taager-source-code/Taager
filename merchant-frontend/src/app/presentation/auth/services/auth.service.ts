import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_URLS } from 'src/app/presentation/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data): Observable<any> {
    return this.http.post(API_URLS.LOGIN_URL, data);
  }
  walletLogin(data): Observable<any> {
    return this.http.post(API_URLS.WALLET_LOGIN_URL, data);
  }
  register(data): Observable<any> {
    return this.http.post(API_URLS.REGISTER_URL, data);
  }
  socialAuthSignIn(data): Observable<any> {
    return this.http.post(API_URLS.SOCIAL_AUTH_SIGN_IN_URL, data, { observe: 'response' }).pipe(map((response: {
      body;
      status;
    }) => ({
        user: response.body.user,
        jwt: response.body.data,
        userIsNew: response.status === 201
      })));
  }
  forgotPassword(data): Observable<any> {
    return this.http.patch(API_URLS.FORGOT_PASSWORD_URL, data);
  }
  changePassword(data): Observable<any> {
    return this.http.patch(API_URLS.CHANGE_PASSWORD_URL, data);
  }
  changeWalletPassword(data): Observable<any> {
    return this.http.patch(API_URLS.CHANGE_WALLET_PASSWORD_URL, data);
  }
  resetPassword(data, id, resetToken): Observable<any> {
    return this.http.patch(API_URLS.RESET_PASSWORD_URL(id, resetToken), data);
  }
  forgotWalletPassword(data): Observable<any> {
    return this.http.patch(API_URLS.FORGOT_WALLET_PASSWORD_URL, { email: data });
  }
  resetWalletPassword(data, id, resetToken): Observable<any> {
    return this.http.patch(API_URLS.RESET_WALLET_PASSWORD_URL(id, resetToken), data);
  }
  getUserByReferralCode(id): Observable<any> {
    return this.http.get(API_URLS.GET_USER_BY_REFERRAL_CODE_URL(id));
  }
  updatePicture(data): Observable<any> {
    return this.http.post(API_URLS.UPDATE_PICTURE_URL, data);
  }
}


