import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { AllocationServiceRepository } from '../../repositories/allocationService.repository';
export class UpdateAllocationServiceStatusUseCase implements UseCase<
{status: string}, void> {
  constructor(private shippingCapacityRepository: AllocationServiceRepository) { }
  execute(
    params: {status: string},
  ): Observable<void> {
    return this.shippingCapacityRepository.updateAllocationServiceStatus(params);
  }
}