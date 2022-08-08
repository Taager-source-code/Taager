import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable()
export class CartService {
  constructor(private http: HttpClient) {}
  addToCart(productId: string, sellerName: string): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/addToCart/${productId}/${sellerName}`;
    return this.http.patch(url, {});
  }
  removeFromCart(productId: string, sellerName: string): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/removeFromCart/${productId}/${sellerName}`;
    return this.http.patch(url, {});
  }
  getCartData(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/user/getCart`;
    return this.http.get(url);
  }
}
