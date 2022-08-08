import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable()
export class ShippingService {
  constructor(private http: HttpClient) {}
  addOrderToBosta(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/addOrderToBosta`;
    return this.http.post(url, formData);
  }
  getAWBFromBosta(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/getAWBFromBosta`;
    return this.http.post(url, formData);
  }
  trackPackageFromBosta(formData) {
    const url = `${environment.BACKEND_URL}api/shipping/trackBostaOrder`;
    return this.http.post(url, formData);
  }
  addOrderToAramex(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/aramex`;
    return this.http.post(url, formData);
  }
  addOrderToVHubs(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/vhubs`;
    return this.http.post(url, formData);
  }
  createShipments(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/shipments`;
    return this.http.post(url, formData);
  }
  trackShipmentFromAramex(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/aramex-track`;
    return this.http.post(url, formData);
  }
  trackShipmentFromVHubs(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/vhubs-track`;
    return this.http.post(url, formData);
  }
  createShipmentsTrackingIDs(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/shipments/bulk-sheet`;
    return this.http.post(url, formData);
  }
  updateShipmentsTrackingIDs(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/shipments/shipment-status`;
    return this.http.put(url, formData);
  }
  revertShipmentsTrackingIDs(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/shipping/shipments/revert`;
    return this.http.patch(url, formData);
  }
}
