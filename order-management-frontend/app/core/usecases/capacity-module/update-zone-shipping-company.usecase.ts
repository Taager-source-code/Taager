import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ShippingCompanyCapacityModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class UpdateZoneShippingCompanyUseCase implements UseCase<
{provinceId: string; zoneId: string; priorityId: string; data: ShippingCompanyCapacityModel}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; zoneId: string; priorityId: string; data: ShippingCompanyCapacityModel},
  ): Observable<void> {
    return this.shippingCapacityRepository.updateZoneShippingCompany(params);
  }
}
