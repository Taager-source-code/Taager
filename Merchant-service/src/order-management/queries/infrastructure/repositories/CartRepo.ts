import mongoose from 'mongoose';
import CartModel from '../../../common/infrastructure/db/schemas/cart.model';

export default class CartRepo {
  public async getAvailableProductsInCartCount(userID, country): Promise<number> {
    const cart = await CartModel.findOne({
      userID: mongoose.Types.ObjectId(userID),
      country,
    }).exec();

    if (!cart || !cart.products) return 0;

    let cartItemsSize = 0;
    cart.products.forEach(function(product) {
      // @ts-ignore
      cartItemsSize += product.qty;
    });
    return cartItemsSize;
  }
}


