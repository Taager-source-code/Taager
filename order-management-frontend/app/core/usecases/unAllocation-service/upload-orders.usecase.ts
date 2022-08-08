import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { UnAllocationModel } from '../../domain/unAllocationService';
import { UnAllocationServiceRepository } from '../../repositories/unAllocationService.repository';
export class UpdateUnAllocationServiceStatusUseCase implements UseCase<
  UnAllocationModel[], UnAllocationModel[]> {
  constructor(private unAllocationRepository: UnAllocationServiceRepository) { }
  execute(
    params: UnAllocationModel[],
  ): Observable<UnAllocationModel[]> {
    return this.unAllocationRepository.uploadOrdersForUnAllocation(params);
  }
}