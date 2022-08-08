import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ClientPhonebookService {
  constructor(private http: HttpClient) {}
  getClientPhonebook(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/clientPhonebook/getClientPhonebook/${id}`;
    return this.http.get(url);
  }
  addClientPhonebook(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/clientPhonebook/addClientPhonebook`;
    return this.http.post(url, formData);
  }
  deleteClientPhonebook(id): Observable<any> {
    const url = `${environment.BACKEND_URL}api/clientPhonebook/delete/${id}`;
    return this.http.delete(url);
  }
  updateClientPhonebook(id, body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/clientPhonebook/updateClientPhonebook/${id}`;
    return this.http.patch(url, body);
  }
}
