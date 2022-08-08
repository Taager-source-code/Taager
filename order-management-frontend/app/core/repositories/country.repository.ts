import { Observable } from 'rxjs';
import { CountryModel } from '@core/domain/country.model';
export abstract class CountryRepository {
    abstract getCountries(): Observable<CountryModel[]>;
}
