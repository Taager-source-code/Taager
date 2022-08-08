import { Injectable } from '@angular/core';
import * as CountryResolver from '@taager-shared/country-resolver';
import { CountryModel } from '@core/domain/country.model';
import { CountryRepository } from '@core/repositories/country.repository';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryApisService } from './country-apis.service';
@Injectable({
  providedIn: 'root',
})
export class CountryRepositoryImpl extends CountryRepository {
  constructor(
    private countryApisService: CountryApisService,
  ) {
    super();
  }
  getCountries(): Observable<CountryModel[]> {
    return this.countryApisService.getCountries().pipe(
      map(
        (list) => list.data.map((item) => CountryResolver.getCountryFromIsoCode2(item.countryIsoCode2)),
      ),
    );
  }
}
