import { CountryRepository } from '@core/repositories/country.repository';
import { UseCase } from '@core/base/use-case';
import { CountryModel } from '@core/domain/country.model';
import { Observable } from 'rxjs';
export class GetCountriesUseCase implements UseCase<void, CountryModel[]> {
    constructor(private countryRepository: CountryRepository) { }
    execute(): Observable<CountryModel[]> {
        return this.countryRepository.getCountries();
    }
}
