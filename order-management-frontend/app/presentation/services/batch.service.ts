import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class BatchAPIService {
    public baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }
    createBatch(data): Observable<any> {
        return this.http.post(this.baseUrl + 'order-batch', data);
    }
    getSpecificBatch(id): Observable<any> {
        return this.http.get(this.baseUrl + `order-batch/${id}`);
    }
    getBatchOrders(id, queryParams): Observable<any> {
        return this.http.get(this.baseUrl + `order-batch/${id}/orders/${queryParams.page}/${queryParams.pageSize}`);
    }
    addOrderToBatch(batchId, data): Observable<any> {
        return this.http.patch(this.baseUrl + `order-batch/${batchId}`, data);
    }
    getBatchSheet(id): Observable<any> {
        return this.http.get(this.baseUrl + `order-batch/${id}/csv`, { observe: 'response', responseType: 'text' });
    }
    getPickList(id): Observable<any> {
        return this.http.get(this.baseUrl + `order-batch/${id}/picklist`,
        { observe: 'response', responseType: 'text' });
    }
    deleteBatch(id): Observable<any> {
        return this.http.delete(this.baseUrl + `order-batch/${id}`);
    }
}
