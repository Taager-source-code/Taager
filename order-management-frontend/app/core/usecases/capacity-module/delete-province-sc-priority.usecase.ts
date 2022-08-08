import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class DeleteProvinceShippingCompanyPriorityUseCase implements UseCase<
{provinceId: string; priorityId: string}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; priorityId: string},
  ): Observable<void> {
    return this.shippingCapacityRepository.deleteProvinceShippingCompanyPriority(params);
  }
}
