import { findOrdersAndUpdate, findOrders } from '../../../../queries/application/usecases/order.service';

async function updateOrders(queryUpdateOrder, updateObj) {
  await findOrdersAndUpdate({
    query: queryUpdateOrder,
    update: {
      $set: updateObj,
    },
  });
}

export const updateMergeableOrders = async (orders, updateObj, remove = false) => {
  const ordersIds = orders.map(x => x._id);

  if (remove) {
    const queryUpdateOrder = {
      _id: {
        $in: ordersIds,
      },
      mergeableOrders: { $ne: [] },
    };

    await updateOrders(queryUpdateOrder, updateObj);
  } else {
    const queryUpdateOrder = {
      _id: {
        $in: ordersIds,
      },
    };

    await updateOrders(queryUpdateOrder, updateObj);
  }
};

const addToMergeableOrders = async (orderToAdd, ordersToUpdate) => {
  // add order id for added order and other orders
  const mergeOrdersValue = ordersToUpdate[0].mergeableOrders ? ordersToUpdate[0].mergeableOrders : [];

  if (mergeOrdersValue.length == 0) mergeOrdersValue.push(ordersToUpdate[0]._id);

  mergeOrdersValue.push(orderToAdd._id);

  // push add order to ordersToupdate
  ordersToUpdate.push(orderToAdd);

  await updateMergeableOrders(ordersToUpdate, {
    mergeableOrders: mergeOrdersValue,
  });
};

// for create order and revert to order recieved
export const logMergeOnOrderReceived = async order => {
  // get all orders with same phone number for input order
  const orders = await findOrders({
    TagerID: order.TagerID,
    phoneNumber: order.phoneNumber,
    status: 'order_received',
  });

  if (orders && orders.length > 1) await addToMergeableOrders(order, orders);
};


