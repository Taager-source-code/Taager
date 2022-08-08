import { Service } from 'typedi';
import CartDao from '../../db/access/cart/CartDao';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import CartRepo from '../../../domain/contracts/cart/CartRepo';
import Cart from '../../../domain/models/Cart';
import CartConverter from '../../db/converters/Cart/CartConverter';
import GetProduct from '../../../../../content-management/queries/application/usecases/product/GetProduct';
import CartDbo from '../../../application/models/cart/CartDbo';
import ProductConverter from '../../db/converters/Product/ProductConverter';
import Product from '../../../domain/models/Product';

@Service({ global: true })
export default class CartRepoImp implements CartRepo {
  private cartDao: CartDao;
  private getProduct: GetProduct;

  constructor(cartDao: CartDao, getProduct: GetProduct) {
    this.cartDao = cartDao;
    this.getProduct = getProduct;
  }

  async findProductById(id: string): Promise<Product | null> {
    Logger.info('Find product by id', { id });

    const product = await this.getProduct.execute({ _id: id });
    if (!product) return null;
    return ProductConverter.toDomain(product);
  }

  async findCart(userId, country): Promise<Cart> {
    Logger.info('Find cart by query', { userId, country });

    const cart = await this.cartDao.find(userId, country);
    if (!cart) return Cart.new(userId, country);
    return CartConverter.toDomain(cart);
  }

  async saveCart(cartDbo: CartDbo): Promise<void> {
    Logger.info('Save cart', {
      cartProductsQuery: cartDbo,
    });

    await this.cartDao.save(cartDbo);
  }
}


