import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PaymentRequestService {
  constructor(private http: HttpClient) {}
  getPaymentRequest(pageSize, pageNum, filterObj): Observable<any> {
    const url = `${environment.BACKEND_URL}api/payment/getPaymentRequests`;
    const bodyParam = { pageSize, page: pageNum, filter: filterObj };
    return this.http.post(url, bodyParam);
  }
  getAllMyPaymentRequests(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/payment/getAllMyPaymentRequests`;
    return this.http.get(url);
  }
  getMyPaymentRequests(pageSize, pageNum): Observable<any> {
    const url = `${environment.BACKEND_URL}api/payment/getMyPaymentRequests`;
    const bodyParam = { pageSize, page: pageNum };
    return this.http.get(url, { params: bodyParam });
  }
  createPaymentRequest(request): Observable<any> {
    const url = `${environment.BACKEND_URL}api/payment/createPaymentRequest`;
    return this.http.post(url, request);
  }
  updatePaymentRequest(id, request): Observable<any> {
    const url = `${environment.BACKEND_URL}api/payment/updatePaymentRequest/${id}`;
    return this.http.patch(url, request);
  }
}
