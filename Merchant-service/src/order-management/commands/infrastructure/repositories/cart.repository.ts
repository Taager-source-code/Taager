import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import CartModel from '../../../common/infrastructure/db/schemas/cart.model';

class CartRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(CartModel);
  }

  async findCart(query) {
    try {
      const result = await this.mongooseServiceInstance.findAll(query);
      return result;
    } catch (err) {
      return err;
    }
  }

  async saveCart(cart) {
    try {
      const result = await this.mongooseServiceInstance.save(cart);
      return result;
    } catch (err) {
      return err;
    }
  }
}

export = CartRepository;


