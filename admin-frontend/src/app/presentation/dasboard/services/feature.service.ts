import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class FeatureService {
  private readonly url: string;
  constructor(private http: HttpClient) {
    this.url = environment.BACKEND_URL;
  }
  getFeatures(): Observable<any> {
    return this.http.get(`${this.url}api/userFeatures/getAllUserFeatures`);
  }
  getFeatureByName(feature): Observable<any> {
    return this.http.get(
      `${this.url}api/userFeatures/getTagerIdsbyFeature/${feature}`
    );
  }
  addFeature(formData): Observable<any> {
    const url = `${environment.BACKEND_URL}api/userFeatures/addUserFeatures`;
    return this.http.post(url, formData);
  }
  updateFeature(id, body): Observable<any> {
    const url = `${environment.BACKEND_URL}api/userFeatures/updateUserFeatures/${id}`;
    return this.http.patch(url, body);
  }
}
