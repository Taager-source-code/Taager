import { DomainEvent } from '../../../../shared-kernel/domain/base/AggregateRoot';
import Cart from '../models/Cart';

export abstract class CartEvent implements DomainEvent {}

export class ProductAddedToCart implements CartEvent {
  private cart: Cart;

  constructor(cart: Cart) {
    this.cart = cart.clone();
  }
}


