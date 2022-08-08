import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ProvinceShippingCompanyPriorityUpdateModel} from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class UpdateProvinceShippingCompanyPriorityUseCase implements UseCase<
{provinceId: string; data: ProvinceShippingCompanyPriorityUpdateModel}, void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; data: ProvinceShippingCompanyPriorityUpdateModel},
  ): Observable<void> {
    return this.shippingCapacityRepository.updateProvinceShippingCompanyPriority(params);
  }
}
