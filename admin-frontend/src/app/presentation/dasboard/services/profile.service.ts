import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable()
export class ProfileService {
  private readonly url: string;
  constructor(private http: HttpClient) {
    this.url = environment.BACKEND_URL;
  }
  getProfile(): Observable<any> {
    return this.http.get(`${this.url}api/user/viewOwnProfile`);
  }
  getPendingOrders(): Observable<any> {
    return this.http.get(`${this.url}api/order/viewMyPendingOrders`);
  }
  // getUserWallet(): Observable<any> {
  //   const url = `${environment.BACKEND_URL}api/wallet/viewMyWallet`;
  //   return this.http.get(url);
  // }
  deleteUserWallet(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/wallet/delete/${id}`;
    return this.http.delete(url);
  }
  addUserWallet(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/wallet/addUserWallet`;
    return this.http.post(url, formData);
  }
  updateUserWallet(id, body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/wallet/updateUserWallet/${id}`;
    return this.http.patch(url, body);
  }
  getMyOrders(pageSize, pageNum, filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewMyOrders`;
    const bodyData = { pageSize, page: pageNum, filterObj: filter };
    return this.http.post(url, bodyData);
  }
  getMyOrdersExtract(filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/viewMyOrdersExtract`;
    const bodyData = { filterObj: filter };
    return this.http.post(url, bodyData);
  }
  searchInMyOrders(pageSize, pageNum, filter): Observable<any> {
    const url = `${environment.BACKEND_URL}api/order/searchInMyOrders`;
    const bodyData = { pageSize, page: pageNum, filter: filter };
    return this.http.post(url, bodyData);
  }
  getProduct(element: string): Observable<any> {
    return this.http.get(`${this.url}api/product/viewProduct/${element}`);
  }
  getUserLoyaltyProgram(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getUserLoyaltyProgram`;
    return this.http.get(url);
  }
}
