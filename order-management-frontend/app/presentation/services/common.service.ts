import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultitenancyService } from './multitenancy.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CommonAPIService {
  public baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private multiTenancyService: MultitenancyService,
  ) { }
  getProvinces(): Observable<any> {
    return this.http.get(this.baseUrl
      + `province/getProvinces?country=${this.multiTenancyService.selectedCountry.countryIsoCode3}`);
  }
  getBatches(data): Observable<any> {
    return this.http.get(this.baseUrl + 'order-batch', { params: data });
  }
  getCategories(): Observable<any> {
    return this.http.get(this.baseUrl
      + `category/getCategories/?country=${this.multiTenancyService.selectedCountry.countryIsoCode3}`);
  }
  getCountryBatch(): Observable<any> {
    return this.http.get(this.baseUrl
      + `order-batch?country=${this.multiTenancyService.selectedCountry.countryIsoCode3}`);
  }
  getUserProfile(): Observable<any> {
    return this.http.get(this.baseUrl
      + `user/viewOwnProfile`);
  }
  getUserRoles(): Observable<any> {
    return this.http.get(this.baseUrl
      + 'user/getUserRoles');
  }
}