import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ZoneShippingCompanyModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class CreateZoneShippingCompanyUseCase implements UseCase<
{provinceId: string; zoneId: string; data: ZoneShippingCompanyModel}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; zoneId: string; data: ZoneShippingCompanyModel},
  ): Observable<void> {
    return this.shippingCapacityRepository.createZoneShippingCompany(params);
  }
}
