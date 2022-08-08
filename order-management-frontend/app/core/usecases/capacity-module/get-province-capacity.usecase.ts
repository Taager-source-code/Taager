import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { ProvinceCapacityModel } from '../../domain/capacity.model';
import { ShippingCapacityRepository } from '../../repositories/capacity.repository';
export class GetProvinceCapacityUseCase implements UseCase<void , ProvinceCapacityModel[]> {
  constructor(private shippingCapacityRepository: ShippingCapacityRepository) { }
  execute(): Observable<ProvinceCapacityModel[]> {
    return this.shippingCapacityRepository.getProvinceCapacity();
  }
}
