import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { ProductAddedToCart } from '../events/ProductAddedToCart';
import Product from './Product';

export default class Cart extends AggregateRoot {
  private readonly _userId: string;
  private readonly _products: Product[];
  private readonly _country: string;

  constructor(userId: string, products: Product[], country: string) {
    super();
    this._userId = userId;
    this._products = products;
    this._country = country;
  }

  static new(userId: string, country: string): Cart {
    return new Cart(userId, [], country);
  }

  add(productToAdd, quantity, overwriteQuantity = false, preferredMerchantPrice = productToAdd.basePrice) {
    const product = this._getProduct(productToAdd);
    if (overwriteQuantity) {
      product.setQuantity(quantity);
    } else {
      product.increaseQuantity(quantity);
    }
    product.updatePrice(preferredMerchantPrice);

    this.raiseEvent(new ProductAddedToCart(this));
  }

  get userId(): string {
    return this._userId;
  }

  get products(): Product[] {
    return this._products;
  }

  get country(): string {
    return this._country;
  }

  private _getProduct(product: Product): Product {
    const foundProduct = this.products.find(item => item.id.toString() === product.id.toString());

    if (foundProduct) return foundProduct;

    this.products.push(product);
    return product;
  }
}


