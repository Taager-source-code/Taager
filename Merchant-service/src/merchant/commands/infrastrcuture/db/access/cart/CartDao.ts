import { Service } from 'typedi';
import { Cart as CartEntity } from '../../../../../../order-management/common/infrastructure/db/models/cart';
import CartModel from '../../../../../../order-management/common/infrastructure/db/schemas/cart.model';
import CartDbo from '../../../../application/models/cart/CartDbo';

@Service({ global: true })
export default class CartDao {
  find(userId, country): Promise<CartEntity | null> {
    return CartModel.findOne({ userID: userId, country })
      .lean(true)
      .exec();
  }

  async save(cartDbo: CartDbo): Promise<void> {
    await CartModel.updateOne(
      {
        userID: cartDbo.userId,
        country: cartDbo.country,
      },
      { $set: { products: cartDbo.products } },
      { upsert: true },
    )
      .lean(true)
      .exec();
  }
}


