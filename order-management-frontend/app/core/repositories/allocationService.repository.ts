import { Observable } from 'rxjs';
import { AllocationStatusModel } from '../domain/allocationService';
export abstract class AllocationServiceRepository {
  abstract getAllocationServiceStatus(): Observable<AllocationStatusModel>;
  abstract updateAllocationServiceStatus(
   params: {status: string}
  ): Observable<void>;
  abstract runAllocationService(): Observable<void>;
}
