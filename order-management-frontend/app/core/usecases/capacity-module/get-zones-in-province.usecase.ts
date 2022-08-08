import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ZoneShippingCompanyPriorityModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class GetZoneShippingCompanyPrioritiesUseCase
implements UseCase<{provinceId: string; zoneId: string},
ZoneShippingCompanyPriorityModel[]> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(params: {provinceId: string; zoneId: string}): Observable<ZoneShippingCompanyPriorityModel[]> {
    return this.shippingCapacityRepository.getZoneShippingCompaniesPriorities(params);
  }
}
