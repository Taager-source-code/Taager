import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { TooLowProductPriceError } from '../../../domain/order.errors';

export function validatePrice(orderedProductPriceSingular, product) {
  // Due to the way the floating point number works and because orderedProductPriceSingular is result of division, we can't
  // just use simple number comparisons.
  if (product.productPrice - orderedProductPriceSingular > Number.EPSILON) {
    throw new TooLowProductPriceError(product, orderedProductPriceSingular);
  }
}

export function calculateOrderProfit(order, products) {
  // Calculate product profit
  const productProfits = products.map((product, index) => {
    const orderedProductQuantity = order.productQuantities[index];
    const orderedProductPriceSum = order.productPrices[index];
    const productId = order.productIds[index];
    const orderedProductPriceSingular = orderedProductPriceSum / orderedProductQuantity;
    const orderedProductProfit = product.productProfit + (orderedProductPriceSingular - product.productPrice);

    validatePrice(orderedProductPriceSingular, product);

    Logger.info('Calculated profit for product', {
      productId,
      orderedProductQuantity,
      orderedProductPriceSum,
      orderedProductPriceSingular,
      orderedProductProfit,
      productProfit: product.productProfit,
      productPrice: product.productPrice,
    });
    return orderedProductProfit;
  });

  // Calculate order profit
  const orderProfit = productProfits.reduce((agg, profit, index) => agg + profit * order.productQuantities[index], 0);

  Logger.info('Calculated profit for order', { orderProfit });

  return {
    productProfitsArray: productProfits,
    orderProfit,
  };
}



