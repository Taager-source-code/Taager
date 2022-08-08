import { Service } from 'typedi';
import { OrderModel } from '../../../../common/infrastructure/db/models/orderModel';
import OrderSchema from '../../../../common/infrastructure/db/schemas/order.model';

@Service({ global: true })
export default class OrderDao {
  findByIds(orderIds: string[]): Promise<OrderModel[]> {
    return OrderSchema.find({
      orderID: {
        $in: orderIds,
      },
    })
      .lean(true)
      .exec();
  }
}


