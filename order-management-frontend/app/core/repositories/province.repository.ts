import { Observable } from 'rxjs';
import { ProvinceModel } from '@core/domain/province.model';
export abstract class ProvinceRepository {
    abstract getProvinces(countryIsoCode3: string): Observable<ProvinceModel[]>;
}
