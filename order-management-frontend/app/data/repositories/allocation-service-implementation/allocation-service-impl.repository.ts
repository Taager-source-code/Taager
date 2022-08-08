import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllocationStatusModel } from '../../../core/domain/allocationService';
import { AllocationServiceRepository } from '../../../core/repositories/allocationService.repository';
import { AllocationServiceAPIservice } from './allocation-service-apis.service';
import { AllocationServiceStatusRepositoryMapper } from './mappers/allocation-service-status-repository.mapper';
@Injectable({
    providedIn: 'root',
})
export class AllocationServiceRepositoryImplementation extends AllocationServiceRepository {
    public allocationServiceStatusMapper = new AllocationServiceStatusRepositoryMapper();
    constructor(
        private allocationServiceAPIService: AllocationServiceAPIservice,
    ) {
        super();
    }
    getAllocationServiceStatus(): Observable<AllocationStatusModel> {
        return this.allocationServiceAPIService.getAllocationServiceStatus();
    }
    updateAllocationServiceStatus(params: {status: string}): Observable<void> {
        return this.allocationServiceAPIService.updateAllocationServiceStatus(params);
    }
    runAllocationService(): Observable<void> {
        return this.allocationServiceAPIService.runAllocationService();
    }
}
