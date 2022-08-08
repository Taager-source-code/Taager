import { Mapper } from '../../../../core/base/mapper';
import { OrderModel } from '../../../../core/domain/order.model';
import { OrderEntity } from '../entities/order-entity';
import { OrderDetailsRepositoryMapper } from './order-details.mapper';
const orderDetailsMapper = new OrderDetailsRepositoryMapper();
export class OrderListRepositoryMapper extends Mapper<OrderEntity, OrderModel> {
    mapFrom(param: OrderEntity): OrderModel {
        return {
            orderId: param.orderId,
            status: param.status,
            placedAt: param.placedAt,
            deliveredAt: param.deliveredAt,
            customerDetails: param.customerDetails,
            shippingInfo: param.shippingInfo,
            orderLines: param.orderLines?.map(orderDetailsMapper.mapFrom),
            cashOnDelivery: param.cashOnDelivery,
        };
    }
    mapTo(param: OrderModel): OrderEntity {
        return {
            orderId: param.orderId,
            status: param.status,
            placedAt: param.placedAt,
            deliveredAt: param.deliveredAt,
            customerDetails: param.customerDetails,
            shippingInfo: param.shippingInfo,
            orderLines: param.orderLines?.map(orderDetailsMapper.mapTo),
            cashOnDelivery: param.cashOnDelivery,
        };
    }
}
