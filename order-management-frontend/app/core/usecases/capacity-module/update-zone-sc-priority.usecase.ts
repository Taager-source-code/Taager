import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ShippingCompanyPriorityModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class UpdateZoneShippingCompanyPriorityUseCase implements UseCase<
{provinceId: string; zoneId: string; data: ShippingCompanyPriorityModel[]}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; zoneId: string; data: ShippingCompanyPriorityModel[]},
  ): Observable<void> {
    return this.shippingCapacityRepository.updateZoneShippingCompanyPriority(params);
  }
}