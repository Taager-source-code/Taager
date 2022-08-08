import { findOrders, findOrdersAndUpdate } from '../../../../queries/application/usecases/order.service';

export const findDuplicateOrders = async orderObj => {
  const date = new Date();
  const fdate = new Date();
  fdate.setDate(date.getDate() - 15);
  const query = {
    createdAt: { $gte: fdate },
    orderReceivedBy: 'Cart',
    $and: [
      {
        $or: [
          {
            $or: [{ phoneNumber: orderObj.phoneNumber }, { phoneNumber2: orderObj.phoneNumber }],
          },
          {
            $or: [{ phoneNumber: orderObj.phoneNumber2 }, { phoneNumber2: orderObj.phoneNumber }],
          },
        ],
      },
      {
        $or: [
          {
            $or: [{ phoneNumber: orderObj.phoneNumber2 }, { phoneNumber2: orderObj.phoneNumber2 }],
          },
          {
            $or: [{ phoneNumber: orderObj.phoneNumber }, { phoneNumber2: orderObj.phoneNumber2 }],
          },
        ],
      },
    ],
  };
  const orders = await findOrders(query);

  return orders.map(order => order._id);
};

export async function updateDuplicateOrders(duplicateOrders, order) {
  if (duplicateOrders.length) {
    await findOrdersAndUpdate({
      query: { _id: { $in: duplicateOrders } },
      update: { $addToSet: { duplicateOrders: order._id } },
    });
  }
}


