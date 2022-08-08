import UserOperationsRate from './userOperationsRates';
import UserOrdersSummary from './userOrderSummary';
import * as snowFlakeQueries from '../../../infrastructure/snowFlake/snowFlakeQueries';

function reduceFunc(accum, order) {
  return accum + order.count;
}

function filterBy(ordersToFilter, filterArray) {
  return ordersToFilter.filter(order => filterArray.includes(order.orderStatus));
}

function filterAndReduceByStatus(allOrders, filterArray) {
  return filterBy(allOrders, filterArray).reduce(reduceFunc, 0);
}

function mapToOrderSummary(orders) {
  const pending = filterAndReduceByStatus(orders, ['item_received_in_inventory', 'order_received']);
  const confirmed = filterAndReduceByStatus(orders, ['confirmed']);
  const suspended = filterAndReduceByStatus(orders, ['suspended', 'delivery_suspended']);
  const delivered = filterAndReduceByStatus(orders, ['delivered']);
  const inProgress = filterAndReduceByStatus(orders, [
    'delivery_in_progress',
    'order_addition_inprogress',
    'replacement_in_progress',
    'pending_shipping_company',
  ]);
  return new UserOrdersSummary(pending, confirmed, suspended, delivered, inProgress);
}

function generateOperationsRate(orderTotals) {
  return new UserOperationsRate(orderTotals.total, orderTotals.confirmedCount, orderTotals.deliveredCount);
}

export const getUserOperationsRateSummary = tagerId => {
  return snowFlakeQueries.getUserOperationsRates(tagerId).then(generateOperationsRate);
};

export const getUserOrdersSummary = (tagerId, fromDate, toDate) => {
  return snowFlakeQueries.getUserOrdersGroupedByStatus(tagerId, fromDate, toDate).then(mapToOrderSummary);
};


