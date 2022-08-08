import CartRepository from '../../infrastructure/repositories/cart.repository';
import {
  findProductById,
  isProductAvailable,
} from '../../../../content-management/commands/application/usecases/product.service';

const cartRepositoryInstance = new CartRepository();

export const findCartByUserID = async query => {
  const newReq = await cartRepositoryInstance.findCart(query);
  if (newReq.length) {
    return newReq[0];
  }
  return { products: [] };
};

function normalizePrice(customPrice, productPrice) {
  if (customPrice && customPrice >= productPrice) {
    return customPrice;
  }
  return productPrice;
}

export const saveUserCartProducts = async (userID, country, products) => {
  await cartRepositoryInstance.saveCart({
    query: { userID, country },
    update: {
      $set: {
        products,
      },
    },
    options: {
      upsert: true,
    },
  });
};

export const getUserCartProductsDetails = async (userID, country) => {
  const userCart = await findCartByUserID({
    userID,
    country,
  });

  return Promise.all(
    userCart.products
      .map(async product => {
        const storedProduct = await findProductById(product.product);
        if (storedProduct) {
          const normalizdePrice = normalizePrice(product.preferredMerchantPrice, storedProduct.productPrice);
          const isPorductAvailableToSeller = isProductAvailable(storedProduct, userID);
          const productProfit = normalizdePrice - storedProduct.productPrice + storedProduct.productProfit;

          return {
            productProfit,
            sellerName: storedProduct.sellerName,
            productName: storedProduct.productName,
            productPrice: normalizdePrice,
            Category: storedProduct.Category,
            categoryId: storedProduct.categoryId,
            id: storedProduct._id,
            image: storedProduct.productPicture,
            productPicture: storedProduct.productPicture,
            pid: storedProduct.prodID,
            qty: product.qty,
            productAvailability: storedProduct.productAvailability,
            isAvailableToSeller: isPorductAvailableToSeller,
            attributes: storedProduct.attributes || [],
          };
        }
        return null;
      })
      .filter(async product => {
        const prod = await product;
        return !!prod;
      }),
  );
};

export const removeProductFromUserCart = async (userID, country, productToRemove) => {
  await cartRepositoryInstance.saveCart({
    query: { userID, country },
    update: {
      $pull: {
        products: { product: productToRemove },
      },
    },
    options: {
      new: false,
    },
  });
};


