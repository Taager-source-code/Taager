import Cart from '../../models/Cart';
import CartDbo from '../../../application/models/cart/CartDbo';
import Product from '../../models/Product';

export default interface CartRepo {
  findProductById(id: string): Promise<Product | null>;
  findCart(userId, country): Promise<Cart>;
  saveCart(cartDbo: CartDbo): Promise<void>;
}


