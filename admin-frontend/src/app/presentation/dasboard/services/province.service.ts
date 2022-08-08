import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class ProvinceService {
  constructor(private http: HttpClient) {}
  getProvinces(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/getProvinces`;
    return this.http.get(url);
  }
  getAllProvinces(pageSize, pageNum, countrySelected?): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/viewProvinces`;
    const bodyParam = { pageSize, page: pageNum, country: countrySelected };
    return this.http.get(url, { params: bodyParam });
  }
  createProvince(province): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/createProvince`;
    return this.http.post(url, province);
  }
  updateProvince(id, province): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/updateProvince/${id}`;
    return this.http.patch(url, province);
  }
  addProvinceZones(provinces): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/addProvinceZones`;
    return this.http.post(url, provinces);
  }
  getAllAramexCities(): Observable<any> {
    const url = `${environment.BACKEND_URL}api/province/aramex-cities`;
    return this.http.get(url);
  }
}
