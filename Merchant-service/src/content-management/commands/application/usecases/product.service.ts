import Product from '../../../queries/infrastructure/db/schemas/ProductModel';

export const findAllProducts = (query, page = 0, pageSize = 100, lean = true) =>
  Product.find(query)
    .limit(pageSize)
    .skip(pageSize * page)
    .lean(lean)
    .exec();

export const findProductById = id => Product.findById(id).exec();

export const findProductsWithIds = (query, lean = true) =>
  Product.find(query)
    .lean(lean)
    .exec();

export const isProductAvailable = (storedProduct, userID) => {
  const visibleToSellers = storedProduct.visibleToSellers || [];
  const isUserInVisibleSellers = visibleToSellers.some(visibleToSeller => String(visibleToSeller) == userID);

  return !(
    storedProduct.productAvailability == 'not_available' ||
    storedProduct.isExpired === true ||
    storedProduct.isExpired === 'true' ||
    (visibleToSellers.length && !isUserInVisibleSellers)
  );
};


