import { Mapper } from '@core/base/mapper';
import { OrderDetailsModel } from '@core/domain/order.model';
import { OrderDetailsEntity } from '../entities/order-entity';
export class OrderDetailsRepositoryMapper extends Mapper<OrderDetailsEntity, OrderDetailsModel> {
  mapFrom(param: OrderDetailsEntity): OrderDetailsModel {
    return {
      orderLineId: param.orderLineId,
      productId: param.productId,
      productName: param.productName,
      quantity: param.quantity,
      pricePerPiece: Math.round((param?.totalPrice * 100)/(param?.quantity)) / 100,
      type: param.type,
      status: param.status,
      trackingNumber: param.trackingNumber,
      shippingCompanyId: param.shippingCompanyId,
      direction: param.direction,
    };
  }
  mapTo(param: OrderDetailsModel): OrderDetailsEntity {
    return {
      orderLineId: param.orderLineId,
      productId: param.productId,
      productName: param.productName,
      quantity: param.quantity,
      totalPrice: Math.round(param?.pricePerPiece * param?.quantity),
      type: param.type,
      status: param.status,
      trackingNumber: param.trackingNumber,
      shippingCompanyId: param.shippingCompanyId,
      direction: param.direction,
    };
  }
}
