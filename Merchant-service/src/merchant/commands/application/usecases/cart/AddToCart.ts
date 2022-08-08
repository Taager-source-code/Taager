import { Service } from 'typedi';
import { AddToCartRequest } from '../../models/cart/AddToCartRequest';
import CartRepo from '../../../domain/contracts/cart/CartRepo';
import { NoProductMatchingIdFoundError } from '../../../../../content-management/queries/application/exceptions/product/NoProductMatchingIdFoundError';

@Service({ global: true })
export default class AddToCart {
  private cartRepo: CartRepo;

  constructor(cartRepo: CartRepo) {
    this.cartRepo = cartRepo;
  }

  public async execute(addToCartRequest: AddToCartRequest): Promise<void> {
    const product = await this.cartRepo.findProductById(addToCartRequest.pid);

    if (!product || product.country != addToCartRequest.countryIsoCode3)
      throw new NoProductMatchingIdFoundError(addToCartRequest.pid);

    const cart = await this.cartRepo.findCart(addToCartRequest.userId, addToCartRequest.countryIsoCode3);

    cart.add(
      product,
      addToCartRequest.qty,
      addToCartRequest.overwriteQuantity,
      addToCartRequest.preferredMerchantPrice,
    );

    const saveCartQuery = {
      userId: cart.userId,
      country: cart.country,
      products: cart.products.map(product => ({
        qty: product.quantity,
        product: product.id,
        preferredMerchantPrice: product.preferredMerchantPrice,
      })),
    };

    await this.cartRepo.saveCart(saveCartQuery);
  }
}


