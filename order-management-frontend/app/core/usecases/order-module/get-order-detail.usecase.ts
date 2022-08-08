import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { OrderModel } from '../../domain/order.model';
import { OrderRepository } from '../../repositories/order.repository';
export class GetOrderDetailUseCase implements UseCase<void, OrderModel> {
  constructor(private orderRepository: OrderRepository) { }
  execute(orderId): Observable<OrderModel> {
    return this.orderRepository.getOrderDetail(orderId);
  }
}