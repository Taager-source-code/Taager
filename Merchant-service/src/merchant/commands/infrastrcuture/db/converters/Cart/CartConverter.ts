import Cart from '../../../../domain/models/Cart';
import {
  Cart as CartEntity,
  CartProduct,
} from '../../../../../../order-management/common/infrastructure/db/models/cart';
import Product from '../../../../domain/models/Product';

export default class CartConverter {
  static toDomain(cartEntity: CartEntity): Cart {
    return new Cart(
      cartEntity.userID as string,
      cartEntity.products.map(product => this.toProduct(product)),
      cartEntity.country,
    );
  }

  private static toProduct(cartProduct: CartProduct): Product {
    return new Product(
      cartProduct.product as string,
      '',
      cartProduct.preferredMerchantPrice as number,
      cartProduct.qty as number,
      cartProduct.preferredMerchantPrice as number,
    );
  }
}


