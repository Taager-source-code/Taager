import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { AllocationServiceRepository } from '../../repositories/allocationService.repository';
export class RunAllocationServicesUseCase implements UseCase<void, void> {
  constructor(private allocationsServiceRepository: AllocationServiceRepository) { }
  execute(): Observable<void> {
    return this.allocationsServiceRepository.runAllocationService();
  }
}