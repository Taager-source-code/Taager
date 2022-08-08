import { Observable } from 'rxjs';
import { UseCase } from '@core/base/use-case';
import { ProvinceModel } from '@core/domain/province.model';
import { ProvinceRepository } from '@core/repositories/province.repository';
export class GetProvincesUseCase implements UseCase<string, ProvinceModel[]> {
  constructor(private provinceRepository: ProvinceRepository) { }
  execute(countryIsoCode3: string): Observable<ProvinceModel[]> {
    return this.provinceRepository.getProvinces(countryIsoCode3);
  }
}
