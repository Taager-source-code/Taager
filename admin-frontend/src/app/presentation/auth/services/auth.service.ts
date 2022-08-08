import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  login(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/auth/login`;
    return this.http.post(url, data);
  }
  forgotPassword(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/auth/forgotPassword`;
    return this.http.patch(url, data);
  }
  resetPassword(data, id, resetToken): Observable<any> {
    const url = `${environment.BACKEND_URL}api/auth/resetPassword/${id}/${resetToken}`;
    return this.http.patch(url, data);
  }
  getUserByReferralCode(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/auth/getUserByReferralCode/${id}`;
    return this.http.get(url);
  }
}
