import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { calculateShippingPrice } from './shippingPriceVerification.service';

export function reconcileCashOnDelivery(shippingCost, productPricesArray) {
  return productPricesArray.reduce((a, b) => a + b, 0) + shippingCost;
}

export async function calculateCashOnDeliveryPrice(order, storedProducts, tagerId) {
  const shippingCost = await calculateShippingPrice(order.province, storedProducts, order.productQuantities, tagerId);
  const calculatedCashOnDelivery = reconcileCashOnDelivery(shippingCost, order.productPrices);
  Logger.info('Calculated cash on delivery', {
    cashOnDelivery: calculatedCashOnDelivery,
  });
  return calculatedCashOnDelivery;
}


