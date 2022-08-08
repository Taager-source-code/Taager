import { Observable } from 'rxjs';
import { UnAllocationModel } from '../domain/unAllocationService';
export abstract class UnAllocationServiceRepository {
  abstract uploadOrdersForUnAllocation(params: UnAllocationModel[]): Observable<UnAllocationModel[]>;
}
