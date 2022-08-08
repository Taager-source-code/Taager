import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ProvinceShippingCompanyPriorityModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class GetProvinceShippingCompanyPrioritiesUseCase
implements UseCase<void ,
ProvinceShippingCompanyPriorityModel[]> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(provinceId): Observable<ProvinceShippingCompanyPriorityModel[]> {
    return this.shippingCapacityRepository.getProvinceShippingCompaniesPriorities(provinceId);
  }
}
