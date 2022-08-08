import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { API_URLS } from "../constants";
import { DBCountry, Country } from "../interfaces/countries";
import * as CountryResolver from "@taager-shared/country-resolver";
@Injectable({
  providedIn: "root",
})
export class SharedService {
  private supportedCountries: Country[] = [];
  userCountryAccess = [];
  selectedCountryIso3: string;
  constructor(private http: HttpClient) {}
  getCountriesList(): Observable<DBCountry[]> {
    return this.http
      .get<{ data: DBCountry[]; msg: string }>(API_URLS.COUNTRIES_LIST_URL)
      .pipe(
        map((res) => {
          return res.data;
        })
      );
  }
  getSupportedCountries(): Promise<Country[]> {
    return new Promise<Country[]>((resolve) => {
      if (this.supportedCountries.length) {
        resolve(this.supportedCountries);
      } else {
        this.getCountriesList()
          .pipe()
          .subscribe((countries) => {
            const availableCountries = countries.map(
              (country) => country.countryIsoCode2
            );
            const supportedCountries = availableCountries.map((countryiso) =>
              CountryResolver.getCountryFromIsoCode2(countryiso)
            );
            this.supportedCountries = supportedCountries;
            resolve(supportedCountries);
          });
      }
    });
  }
}