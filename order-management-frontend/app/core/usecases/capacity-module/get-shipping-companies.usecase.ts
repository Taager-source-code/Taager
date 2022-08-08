import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ShippingCompanyModel } from '../../domain/shippingCompany';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class GetShippingCompaniesUseCase implements UseCase<void , ShippingCompanyModel[]> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(): Observable<ShippingCompanyModel[]> {
    return this.shippingCapacityRepository.getShippingCompanies();
  }
}