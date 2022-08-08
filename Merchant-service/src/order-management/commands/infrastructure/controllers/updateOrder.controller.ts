import { OK } from 'http-status';
import { findOrdersAndUpdate } from '../../../../queries/application/usecases/order.service';
/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const rateOrder = async (req, res) => {
  const UpdateObj = {
    rating: req.body.rating,
    complain: req.body.complain,
  };
  const QueryUpdateOrder = {
    _id: req.body.orderID,
    TagerID: req.decodedToken.user.TagerID,
  };
  await findOrdersAndUpdate({
    query: QueryUpdateOrder,
    update: {
      $set: UpdateObj,
    },
  });
  return res.status(OK).json({
    msg: 'Order(s) verified successfully',
    data: {},
  });
};


