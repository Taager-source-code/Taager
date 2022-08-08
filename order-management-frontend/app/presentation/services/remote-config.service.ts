import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface Country {
    countryIsoCode2: string;
    countryIsoCode3: string;
    currency?: Currency;
    englishName?: string;
    arabicName?: string;
}
export interface Currency {
    englishName: string;
    arabicName: string;
}
export const MULTITENANCY_URLS = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    COUNTRIES_URL: `${environment.baseUrl}countries`,
};
@Injectable({
    providedIn: 'root',
})
export class MultitenancyService {
    selectedCountry: Country;
    constructor(
        private http: HttpClient,
    ) {
        this.selectedCountry = {
            countryIsoCode2: 'EG',
            countryIsoCode3: 'EGY',
        };
    }
    fetchCountriesCodes(): Observable<any> {
        return this.http.get(MULTITENANCY_URLS.COUNTRIES_URL);
    };
}
