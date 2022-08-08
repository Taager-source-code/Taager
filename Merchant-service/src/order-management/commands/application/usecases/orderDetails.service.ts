import { calculateOrderProfit } from './orderFinancials/orderProfitCalculator.service';
import { calculateCashOnDeliveryPrice } from './orderFinancials/orderCashOnDeliveryCalculator.service';
import { removeOrderedProductsFromCart } from './cart/cart.service';
import { findDuplicateOrders, updateDuplicateOrders } from './duplicate-orders/duplicateOrders.service';
import { logMergeOnOrderReceived } from './mergeable-orders/mergeableOrders.service';
import { createOrder } from '../../../queries/application/usecases/order.service';
import { createOrderActivity } from './orderActivity.service';
import { findUserById } from '../../../../merchant/queries/application/usecases/user.service';
import { getOrderProducts } from '../../../queries/application/usecases/order-products/orderProducts.service';
import { isProductAvailable } from '../../../../content-management/commands/application/usecases/product.service';
import { calculateShippingPrice } from './orderFinancials/shippingPriceVerification.service';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';
import { findProvinceByName } from './province.service';
import ProductNotFoundError from '../../../../content-management/commands/domain/exceptions/product.errors';
import OrderLine from '../../domain/OrderLine';
import Env from '../../../../Env';
import { Container } from 'typedi';
import { BlockedEndCustomersRepoImpl } from '../../infrastructure/repositories/BlockedEndCustomersRepoImpl';
import { isEndCustomerSpammerBlockEnabled } from '../../../../shared-kernel/infrastructure/toggles/activeFeatureToggles';

async function getStoredProducts(body, country) {
  const inputProductsObjectIds =
    body.orderedProducts && body.orderedProducts.length
      ? body.orderedProducts.map(product => product.productObjectId)
      : body.products;
  const products = await getOrderProducts(inputProductsObjectIds);
  if (!products) throw new ProductNotFoundError(inputProductsObjectIds);

  //filter by country
  const productsInCurrencyCountry = products.filter(product => product.country == country);
  if (productsInCurrencyCountry.length !== inputProductsObjectIds.length) {
    throw new ProductNotFoundError(inputProductsObjectIds);
  }
  return productsInCurrencyCountry;
}
export async function getBlockedEndCustomer(phoneNum1, phoneNum2) {
  return await Container.of()
    .get(BlockedEndCustomersRepoImpl)
    .findBlockedEndCustomerByPhone(phoneNum1, phoneNum2);
}

export async function saveOrder(
  body,
  req,
  duplicateOrders,
  productProfitsArray,
  orderProfit,
  orderedProducts,
  cashOnDelivery,
) {
  Object.assign(body, {
    pid: body.productIds[0],
    sellerName: 'AdminDefault',
    orderedBy: req.decodedToken.user._id,
    TagerID: req.decodedToken.user.TagerID,
    country: req.country.countryIsoCode3,
    orderedByName: req.decodedToken.user.username,
    orderReceivedBy: body.orderReceivedBy ? body.orderReceivedBy : 'Cart',
    duplicateOrders,
    productProfits: productProfitsArray,
    orderProfit,
    orderedProducts,
    cashOnDelivery,
    orderLines: orderedProducts.map((product, index) =>
      OrderLine.newOrderLine(
        index + 1,
        product.prodID,
        body.productQuantities[index],
        body.productPrices[index],
        productProfitsArray[index] * body.productQuantities[index],
      ),
    ),
  });
  return await createOrder(body);
}

async function addFieldsToOrderAndSave(order, req) {
  Object.assign(order, {
    orderID: `${order.TagerID}/${order.orderNum}`,
    OrderPhoneNum: req.decodedToken.user.username,
  });
  await order.save();
}

async function saveOrderActivity(order, req) {
  const createActivityObj: any = {
    orderStatus: 'order_received',
    orderObjectId: order._id,
    orderID: `${order.TagerID}/${order.orderNum}`,
  };
  if (req.body.notes) {
    createActivityObj.notes = req.body.notes;
  }
  await createOrderActivity(createActivityObj);
}

export const makeOrderByCartStatuses = Object.freeze({
  UN_AUTHORIZED_ACTION: { code: 1, msg: 'Un-authorized action' },
  ONE_OR_MORE_PRODUCT_IS_NOT_AVAILABLE: {
    code: 3,
    msg: 'One or more products is not available',
  },
  ORDER_CREATED: { code: 4, msg: 'Order created!' },
  ORDER_PRICE_EXCEED_LIMIT: { code: 5, msg: 'Order Price exceeds the allowed limit of ' + Env.ORDER_PRICE_LIMIT },
  SPAMMER_END_CUSTOMER: {
    code: 6,
    msg: 'The order you have placed is blocked because of the end-user historical spam behavior',
  },
});

export async function makeOrderByCart(req, body) {
  const user = await findUserById(req.decodedToken.user._id);
  const tagerId = req.decodedToken.user.TagerID;
  const products = await getStoredProducts(body, req.country.countryIsoCode3);
  const unavailableProducts = products.filter(prod => !isProductAvailable(prod, user._id));

  if (unavailableProducts.length > 0) {
    return {
      status: makeOrderByCartStatuses.ONE_OR_MORE_PRODUCT_IS_NOT_AVAILABLE.code,
      result: {
        msg: makeOrderByCartStatuses.ONE_OR_MORE_PRODUCT_IS_NOT_AVAILABLE.msg,
        data: {
          products: unavailableProducts,
        },
      },
    };
  }

  const spammerEndCustomerFound = await getBlockedEndCustomer(req.body.phoneNumber, req.body.phoneNumber2);

  if (isEndCustomerSpammerBlockEnabled(tagerId) && spammerEndCustomerFound) {
    Logger.warn(`Order blocked because of the end-user historical spam behavior`, {
      domain: `order-management`,
      endCustomerPhone: req.body.phoneNumber,
    });
    return {
      status: makeOrderByCartStatuses.SPAMMER_END_CUSTOMER.code,
      result: {
        msg: makeOrderByCartStatuses.SPAMMER_END_CUSTOMER.msg,
      },
    };
  }
  const { productProfitsArray, orderProfit } = calculateOrderProfit(body, products);

  const duplicateOrders = await findDuplicateOrders(req.body);
  const cashOnDelivery = await calculateCashOnDeliveryPrice(body, products, tagerId);

  if (cashOnDelivery > Env.ORDER_PRICE_LIMIT)
    return {
      status: makeOrderByCartStatuses.ORDER_PRICE_EXCEED_LIMIT.code,
      result: {
        msg: makeOrderByCartStatuses.ORDER_PRICE_EXCEED_LIMIT.msg,
      },
    };
  const order = await saveOrder(body, req, duplicateOrders, productProfitsArray, orderProfit, products, cashOnDelivery);
  if (order) {
    await addFieldsToOrderAndSave(order, req);
    await removeOrderedProductsFromCart(req);
    await saveOrderActivity(order, req);
    const orderId = `${order.TagerID}/${order.orderNum}`;
    Logger.info(`Order created: ${orderId}`, { domain: `order-management`, orderId: orderId });
    // find mergeable existing orders
    // assign mergeable array to current new order
    // update mergeable array for the other orders
    await logMergeOnOrderReceived(order);
    await updateDuplicateOrders(duplicateOrders, order);
    return {
      status: makeOrderByCartStatuses.ORDER_CREATED.code,
      result: {
        msg: makeOrderByCartStatuses.ORDER_CREATED.msg,
        order: {
          orderID: order.orderID,
        },
      },
      orderDetails: {
        TagerID: order.TagerID,
        orderID: order.orderID,
        province: order.province,
        country: order.country,
        cartSize: order.productQuantities.reduce((totalResult, currValue) => totalResult + currValue, 0),
        cashOnDelivery: order.cashOnDelivery,
        phoneNumber: body.phoneNumber,
      },
    };
  }
}

export async function retrieveOrderFinancialBreakdown(orderCostBreakdown, tagerId, country) {
  const storedProducts = await getStoredProducts(orderCostBreakdown, country);
  const discountedShippingRate = await calculateShippingPrice(
    orderCostBreakdown.province,
    storedProducts,
    orderCostBreakdown.productQuantities,
    tagerId,
  );
  Logger.info('successfully calculated the shipping rate for order', {
    discountedRate: discountedShippingRate,
  });
  const shippingProvince = await findProvinceByName(orderCostBreakdown.province, true);
  return {
    shipping: {
      discountedRate: discountedShippingRate,
      regularRate: shippingProvince[0].shippingRevenue,
    },
  };
}


