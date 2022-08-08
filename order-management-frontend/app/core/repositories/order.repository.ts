import { Observable } from 'rxjs';
import { OrderFilterModel } from '../domain/filters-model/order-filter.model';
import { OrderModel, OrderModelStructure } from '../domain/order.model';
export abstract class OrderRepository {
    abstract getOrdersList(filter: OrderFilterModel): Observable<OrderModelStructure>;
    abstract getOrderDetail(orderId: string): Observable<OrderModel>;
}
