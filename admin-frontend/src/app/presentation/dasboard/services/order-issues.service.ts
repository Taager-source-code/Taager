import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_URLS } from "../../shared/constants";
@Injectable({
  providedIn: "root",
})
export class OrderIssuesService {
  constructor(private http: HttpClient) {}
  addChildOrder(orderIssues): Observable<any> {
    return this.http.post(API_URLS.ADD_CHILD_ORDER, orderIssues);
  }
  addIssueAttachment(formData) {
    return this.http.post(API_URLS.ADD_ISSUE_ATTACHMENT_URL, formData);
  }
}