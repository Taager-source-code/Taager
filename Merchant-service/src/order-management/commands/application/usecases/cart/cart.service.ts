import { saveUserCartProducts, findCartByUserID } from '../cart.service';
import { findUserById } from '../../../../../merchant/queries/application/usecases/user.service';

export async function removeOrderedProductsFromCart(req) {
  const user = await findUserById(req.decodedToken.user._id);

  if (user) {
    const userCart = await findCartByUserID({
      userID: user._id,
      country: req.country.countryIsoCode3,
    });

    const cartProducts = userCart.products.filter(item => {
      return !req.body.products.some(i => item.product.equals(i));
    });

    await saveUserCartProducts(user._id, req.country.countryIsoCode3, cartProducts);

    user.fullName = 'Default';

    await user.save();
  }
}


