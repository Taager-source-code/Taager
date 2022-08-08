import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_URLS } from '../../constants/api-urls';
import { OrderDetailResponseEntity, OrderResponseEntity } from './entities/order-entity';
import { OrderFilterModel } from '../../../core/domain/filters-model/order-filter.model';
@Injectable({
  providedIn: 'root',
})
export class OrderAPIservice {
  constructor(private http: HttpClient) { }
  getOrderList(filter: OrderFilterModel): Observable<OrderResponseEntity> {
    const params = this.filterQuery(filter);
    return this.http.get<OrderResponseEntity>(API_URLS.ORDERS_LIST(params));
  }
  getOrderDetail(orderId: string): Observable<OrderDetailResponseEntity> {
    return this.http.get<OrderDetailResponseEntity>(API_URLS.ORDER_DETAILS(encodeURIComponent(orderId)));
  }
  filterQuery(filter) {
    const updatedFilter = Object.entries(filter)
      .filter(([_, v]) => v != null)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    const params = new URLSearchParams();
    for (const key in updatedFilter) {
      if (filter.hasOwnProperty(key)) {
        params.set(key, filter[key]);
      }
    }
    return params;
  }
}