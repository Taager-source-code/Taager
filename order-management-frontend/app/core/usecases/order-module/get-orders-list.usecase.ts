import { Observable } from 'rxjs';
import { UseCase } from '../../base/use-case';
import { OrderFilterModel } from '../../domain/filters-model/order-filter.model';
import { OrderModelStructure } from '../../domain/order.model';
import { OrderRepository } from '../../repositories/order.repository';
export class GetOrdersListUseCase implements UseCase<OrderFilterModel , OrderModelStructure> {
  constructor(private orderRepository: OrderRepository) { }
  execute(filter: OrderFilterModel): Observable<OrderModelStructure> {
    return this.orderRepository.getOrdersList(filter);
  }
}
