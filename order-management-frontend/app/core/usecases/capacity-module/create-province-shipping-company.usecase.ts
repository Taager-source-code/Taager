import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ProvinceShippingCompanyModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class CreateProvinceShippingCompanyUseCase
implements UseCase<
{provinceId: string; data: ProvinceShippingCompanyModel},
void> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(
    params: {provinceId: string; data: ProvinceShippingCompanyModel},
  ): Observable<void> {
    return this.shippingCapacityRepository.createProvinceShippingCompany(params);
  }
}
