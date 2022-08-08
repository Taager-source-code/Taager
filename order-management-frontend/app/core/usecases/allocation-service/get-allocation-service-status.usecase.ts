import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { AllocationStatusModel } from '../../domain/allocationService';
import { AllocationServiceRepository } from '../../repositories/allocationService.repository';
export class GetAllocationServiceStatusUseCase implements UseCase<void , AllocationStatusModel> {
  constructor(private allocationsServiceRepository: AllocationServiceRepository) { }
  execute(): Observable<AllocationStatusModel> {
    return this.allocationsServiceRepository.getAllocationServiceStatus();
  }
}
