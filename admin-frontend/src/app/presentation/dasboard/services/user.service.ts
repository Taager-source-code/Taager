import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}
  private createCountryHeader(country: string) {
    return {
      headers: new HttpHeaders({
        country: country,
      }),
    };
  }
  getUsers(pageSize, pageNum, filterObj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/viewUsers`;
    const bodyParam = { pageSize, page: pageNum, filter: filterObj };
    return this.http.post(url, bodyParam);
  }
  getAdminUsers(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/viewAdminUsers`;
    return this.http.get(url);
  }
  getAllAdminUsers(pageSize, pageNum, filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getAllAdminUsers`;
    const bodyParam = { pageSize, page: pageNum, filter };
    return this.http.post(url, bodyParam);
  }
  getAdminUserRoles(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getAdminUserRoles`;
    return this.http.get(url);
  }
  getUserRolesAndPrivileges(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/viewUserRolesAndPrivileges/${id}`;
    return this.http.get(url);
  }
  viewUsersExtract(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/viewUsersExtract`;
    return this.http.get(url);
  }
  deleteUser(user): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/deleteUserProfile`;
    return this.http.patch(url, user);
  }
  getUser(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/viewUserProfile/${id}`;
    return this.http.get(url);
  }
  getUserByTaagerId(id): Observable<any> {
    if (!id) {
      return null;
    }
    const url = `${environment.BACKEND_URL}api/user/getUserByTaagerId/${id}`;
    return this.http.get(url);
  }
  getUserLevel(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getUserLevel`;
    return this.http.get(url);
  }
  getUserRoles(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getUserRoles`;
    return this.http.get(url);
  }
  generateReferralCode(user): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/generateReferralCode`;
    return this.http.post(url, user);
  }
  getAnnouncement(countryIso3: string): Observable<any> {
    const url = `${environment.BACKEND_URL}api/announcement/getAnnouncements`;
    const params = { country: countryIso3 };
    return this.http.get(url, { params: params });
  }
  addImage(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/announcement/addImage`;
    return this.http.post(url, formData);
  }
  addAnnouncement(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/announcement/createAnnouncement`;
    return this.http.post(url, formData);
  }
  deleteAnnouncement(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/announcement/delete/${id}`;
    return this.http.delete(url);
  }
  migrateUserRolesAndPrivileges(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/migrateUserRolesAndPrivileges`;
    return this.http.get(url);
  }
  getAllPrivileges(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getAllPrivileges`;
    return this.http.get(url);
  }
  setUserRole(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/setUserRole`;
    return this.http.post(url, formData);
  }
  setUserLevel(data): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/setUserLevel`;
    return this.http.post(url, data);
  }
}
