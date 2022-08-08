import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_URLS } from "../../shared/constants";
@Injectable({
  providedIn: "root",
})
export class WarehouseService {
  constructor(private http: HttpClient) {}
  generatePickList(requestBody): Observable<any> {
    return this.http.post(API_URLS.GENERATE_PICK_LIST_URL, requestBody);
  }
}
