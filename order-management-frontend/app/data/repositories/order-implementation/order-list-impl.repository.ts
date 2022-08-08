import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderListRepositoryMapper } from './mappers/orders-list-repository.mapper';
import { OrderRepository } from '../../../core/repositories/order.repository';
import { OrderAPIservice } from './order-apis.service';
import { OrderModel, OrderModelStructure } from '../../../core/domain/order.model';
import { OrderFilterModel } from '../../../core/domain/filters-model/order-filter.model';
@Injectable({
    providedIn: 'root',
})
export class OrderRepositoryImplementation extends OrderRepository {
    public orderListMapper = new OrderListRepositoryMapper();
    constructor(
        private orderAPIService: OrderAPIservice,
    ) {
        super();
    }
    getOrdersList(filter: OrderFilterModel): Observable<OrderModelStructure> {
        return this.orderAPIService.getOrderList(filter).pipe(
            map(res => ({
                count: res.data?.count,
                result: res.data?.orders.map(this.orderListMapper.mapFrom),
            })),
          );
      }
    getOrderDetail(orderId: string): Observable<OrderModel> {
        return this.orderAPIService.getOrderDetail(orderId).pipe(
            map(response => this.orderListMapper.mapFrom(response.data)),
        );
    }
}
