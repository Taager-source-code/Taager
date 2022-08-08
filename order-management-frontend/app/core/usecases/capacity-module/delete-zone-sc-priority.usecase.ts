import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class DeleteZoneShippingCompanyPriorityUseCase implements UseCase<
{provinceId: string; zoneId: string; priorityId: string}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; zoneId: string; priorityId: string},
  ): Observable<void> {
    return this.shippingCapacityRepository.deleteZoneShippingCompanyPriority(params);
  }
}
