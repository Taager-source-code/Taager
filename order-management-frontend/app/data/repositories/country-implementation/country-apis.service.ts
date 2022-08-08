import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URLS } from '@data/constants/api-urls';
import { CountryListResponseEntity } from './entities/country.entity';
@Injectable({
  providedIn: 'root',
})
export class CountryApisService {
  constructor(private http: HttpClient) { }
  getCountries(): Observable<CountryListResponseEntity> {
    return this.http.get<CountryListResponseEntity>(API_URLS.COUNTRIES_LIST_URL);
  }
}