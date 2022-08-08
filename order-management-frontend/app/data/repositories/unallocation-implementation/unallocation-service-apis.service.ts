import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URLS } from '../../constants/api-urls';
import { UnAllocationModel } from '../../../core/domain/unAllocationService';
@Injectable({
    providedIn: 'root',
})
export class UnAllocationServiceAPIservice {
    constructor(private http: HttpClient) { }
    runUnAllocationServiceOnFile(params): Observable<UnAllocationModel[]> {
        return this.http.patch<UnAllocationModel[]>(API_URLS.UPDATE_UNALLOCATION, params);
    }
}
