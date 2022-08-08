import { NOT_FOUND, OK } from 'http-status';
import { Service } from 'typedi';
import { AddToCartRequest } from '../../../application/models/cart/AddToCartRequest';
import AddToCart from '../../../application/usecases/cart/AddToCart';
import { NoProductMatchingIdFoundError } from '../../../../../content-management/queries/application/exceptions/product/NoProductMatchingIdFoundError';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import joi from 'joi';
import CartRepoImp from '../../repositories/cart/CartRepoImp';
import { Request } from 'express';

@Service({ global: true })
export default class AddToCartWithCustomPriceController extends HttpProcessor {
  private _cartRepo: CartRepoImp;

  constructor(cartRepo: CartRepoImp) {
    super();
    this._cartRepo = cartRepo;
  }

  getValueToValidate(req: Request): any {
    return req.body;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    const addToCartRequest: AddToCartRequest = {
      qty: joiValidatedValue.quantity,
      overwriteQuantity: joiValidatedValue.shouldOverwriteQuantity,
      pid: joiValidatedValue.productId,
      preferredMerchantPrice: joiValidatedValue.preferredMerchantPrice,
      countryIsoCode3: req.country.countryIsoCode3,
      userId: req.decodedToken.user._id,
    };

    try {
      const addToCart = new AddToCart(this._cartRepo);
      await addToCart.execute(addToCartRequest);

      return {
        status: OK,
        data: {},
      };
    } catch (err) {
      if (err instanceof NoProductMatchingIdFoundError)
        return {
          status: NOT_FOUND,
          data: {},
        };
      else throw err;
    }
  }

  schema = joi
    .object({
      productId: joi.string().required(),
      quantity: joi.number().required(),
      shouldOverwriteQuantity: joi.boolean().optional(),
      preferredMerchantPrice: joi.number().optional(),
    })
    .options({ allowUnknown: true, stripUnknown: true });
}


