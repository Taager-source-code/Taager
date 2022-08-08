import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AllocationStatusEntity } from './entities/allocation-service-entity';
import { API_URLS } from '../../constants/api-urls';
@Injectable({
    providedIn: 'root',
})
export class AllocationServiceAPIservice {
    constructor(private http: HttpClient) { }
    getAllocationServiceStatus(): Observable<AllocationStatusEntity> {
        return this.http.get<AllocationStatusEntity>(API_URLS.ALLOCATION_SERVICE_STATUS_URL);
    }
    updateAllocationServiceStatus(params): Observable<void> {
        return this.http.put<void>
            (API_URLS.ALLOCATION_SERVICE_STATUS_URL, params);
    }
    runAllocationService(): Observable<void>{
        return this.http.post<void>(API_URLS.RUN_ALLOCATION_SERVICE_URL, '');
    }
}
