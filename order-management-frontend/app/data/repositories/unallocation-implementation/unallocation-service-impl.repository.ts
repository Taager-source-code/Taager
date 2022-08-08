import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnAllocationModel } from '../../../core/domain/unAllocationService';
import { UnAllocationServiceRepository } from '../../../core/repositories/unAllocationService.repository';
import { UnAllocationServiceAPIservice } from './unallocation-service-apis.service';
@Injectable({
    providedIn: 'root',
})
export class UnAllocationServiceRepositoryImplementation extends UnAllocationServiceRepository {
    constructor(
        private unAllocationServiceAPIService: UnAllocationServiceAPIservice,
    ) {
        super();
    }
    uploadOrdersForUnAllocation(params: UnAllocationModel[]): Observable<UnAllocationModel[]> {
        return this.unAllocationServiceAPIService.runUnAllocationServiceOnFile(params);
    }
}
