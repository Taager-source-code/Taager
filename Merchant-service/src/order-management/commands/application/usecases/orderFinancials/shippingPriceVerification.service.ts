import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { findProvinceByName } from '../province.service';
import { InvalidProvinceError } from '../../../domain/order.errors';
import { isShippingDiscountEnabled } from '../../../../../shared-kernel/infrastructure/toggles/activeFeatureToggles';

import Env from '../../../../../Env';

export function isFreeShippingApplicable(storedProducts, productsQuantityArray, tagerId) {
  if (!isShippingDiscountEnabled(tagerId)) return false;

  if (storedProducts.length === productsQuantityArray.length && storedProducts.length !== 0) {
    const totalProductsCosts = productsQuantityArray.map((num, idx) => {
      return num * storedProducts[idx].productPrice;
    });
    const totalOrderBaseCost = totalProductsCosts.reduce((a, b) => a + b, 0);

    if (totalOrderBaseCost >= Env.FREE_SHIPPING_THRESHOLD) {
      Logger.info('This order meets free shipping discount', {
        orderBaseCost: totalOrderBaseCost,
      });
      return true;
    }
    return false;
  }
  Logger.info('No products found in order cart');
  return false;
}

export async function calculateShippingPrice(province, storedProducts, productQuantityArray, tagerId) {
  const shippingProvince = await findProvinceByName(province, true);
  if (shippingProvince && shippingProvince.length !== 0) {
    if (isFreeShippingApplicable(storedProducts, productQuantityArray, tagerId)) {
      return 0;
    }
    return shippingProvince[0].shippingRevenue;
  }
  Logger.info('Province not found', {
    province,
  });
  throw new InvalidProvinceError(province);
}


