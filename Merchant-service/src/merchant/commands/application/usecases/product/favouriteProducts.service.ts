import * as favouriteProductsRepositoryInstance from '../../../infrastrcuture/repositories/favouriteProduct.repository';

import {
  findProductById,
  findProductsWithIds,
  isProductAvailable,
} from '../../../../../content-management/commands/application/usecases/product.service';
import { isObjectId } from '../../../../../authentication/commands/infrastructure/utils/validations';
import { ProductModel } from '../../../../../content-management/queries/infrastructure/db/models/ProductModel';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { ProductNotFoundError } from '../../../../../content-management/commands/domain/exceptions/productNotFound.error';

function assertProductInThisCountry(country: string, product: ProductModel) {
  // check if this product in the same country the merchant is coming from
  if (product.country != country) {
    Logger.info('This product is not available for this country', {
      productId: product._id,
      country: country,
    });

    throw new ProductNotFoundError(product._id);
  }
}

const addProductToFavourites = async (taagerId, product, country) => {
  return favouriteProductsRepositoryInstance.addProductToFavouriteProducts({
    taagerId,
    product,
    country,
  });
};

const findProductsInFavourites = async (country, taagerId, productObjectId) => {
  return favouriteProductsRepositoryInstance.findOneFavouriteProduct({
    country,
    taagerId,
    productObjectId,
  });
};

export const favouriteProduct = async (country, productObjectId, user) => {
  if (!isObjectId(productObjectId)) return false;

  const product = await findProductById(productObjectId);
  if (!product) return false;

  assertProductInThisCountry(country.countryIsoCode3, product);

  const productInFavouriteProducts = await findProductsInFavourites(country.countryIsoCode3, user.TagerID, product._id);
  if (productInFavouriteProducts) return false;

  await addProductToFavourites(
    user.TagerID,
    {
      _id: product._id,
      price: product.productPrice,
      customPrice: product.productPrice,
    },
    country.countryIsoCode3,
  );
  return true;
};

const removeProductFromFavourites = async (country, taagerId, productObjectId) => {
  return favouriteProductsRepositoryInstance.removeProductFromFavouriteProducts({ country, taagerId, productObjectId });
};

export const unFavouriteProduct = async (country, productObjectId, user) => {
  if (!isObjectId(productObjectId)) return false;
  const taagerId = user.TagerID;
  await removeProductFromFavourites(country.countryIsoCode3, taagerId, productObjectId);
  return true;
};

const getFavouritProducts = async (country, taagerId) => {
  return favouriteProductsRepositoryInstance.findFavouriteProduct({
    country,
    taagerId,
  });
};

function getCustomFavouriteProducts(products, favouritProductsObject, userID) {
  return products
    .filter(product => String(product._id) === String(favouritProductsObject[product._id]._id))
    .map(product => ({
      _id: product._id,
      price: favouritProductsObject[product._id].price,
      customPrice: favouritProductsObject[product._id].customPrice,
      productPrice: product.productPrice,
      productName: product.productName,
      productProfit: product.productProfit,
      prodID: product.prodID,
      Category: product.Category,
      productPicture: product.productPicture,
      productAvailability: product.productAvailability,
      isAvailableToSeller: isProductAvailable(product, userID),
      attributes: product.attributes || [],
    }));
}

export const getFavouriteProducts = async (country, user) => {
  const favouritProduct = await getFavouritProducts(country.countryIsoCode3, user.TagerID);
  if (!favouritProduct) return [];

  const favouritProductsList = favouritProduct.products || [];
  if (!favouritProductsList.length) return [];

  const favouritProductsListIds = favouritProductsList.map(product => product._id);
  const favouritProductsListObject = {};
  favouritProductsList.forEach(favouritProduct => {
    favouritProductsListObject[favouritProduct._id] = favouritProduct;
  });

  const products = await findProductsWithIds({
    _id: { $in: favouritProductsListIds },
  });
  if (!products.length) return [];

  return getCustomFavouriteProducts(products, favouritProductsListObject, user._id);
};

export const isProductInFavourites = async (country, productObjectId, user) => {
  if (!isObjectId(productObjectId)) return false;

  const productInFavouriteProducts = await findProductsInFavourites(
    country.countryIsoCode3,
    user.TagerID,
    productObjectId,
  );
  if (!productInFavouriteProducts) return false;

  return true;
};

const updateFavouriteProductPrice = async (country, taagerId, productObjectId, price) => {
  return favouriteProductsRepositoryInstance.updateFavouriteProductPrice({
    country,
    taagerId,
    productObjectId,
    price,
  });
};

export const updateProductCustomPrice = async (country, productObjectId, newPrice, user) => {
  if (!isObjectId(productObjectId)) return {};

  const product = await findProductById(productObjectId);
  if (!product) return {};

  if (newPrice < product.productPrice) return {};

  await updateFavouriteProductPrice(country.countryIsoCode3, user.TagerID, productObjectId, newPrice);
  return { customPrice: newPrice };
};


