import { OK, NOT_FOUND } from 'http-status';

import mongoose from 'mongoose';
import {
  findAllOrdersWithUnreadMessages,
  countOrders,
  findAllOrdersWithMessages,
  findMyOrders,
  findOrdersExtract,
  findAllMyOrdersWithPagination,
} from '../../../application/usecases/order.service';

/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const viewAllOrdersWithMessagesUser = async (req, res) => {
  const page = +(req.body.page - 1);
  const pageSize = +req.body.pageSize;
  const country = req.body.country;
  // todo: database logic to repository layer business logic to service layer
  const query: any = {
    ConversationId: {
      $ne: null,
    },
    orderedBy: new mongoose.Types.ObjectId(req.decodedToken.user._id),
  };
  if (country) query.country = country;
  const orders = await findAllOrdersWithMessages(query, page, pageSize);
  const counted = await countOrders(query);
  const endflag = Math.ceil(counted / pageSize) === req.body.page;

  if (orders) {
    return res.status(OK).json({
      msg: 'Orders message list found!',
      data: orders,
      endPages: endflag,
      count: counted,
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "Orders can't be retrieved",
  });
};

/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const viewOrdersWithUnreadMessagesUser = async (req, res) => {
  // todo: database logic to repository layer business logic to service layer
  const page = +(req.body.page - 1);
  const pageSize = +req.body.pageSize;
  const country = req.body.country;
  const query: any = {
    ConversationId: {
      $ne: null,
    },
    isUserRead: false,
    orderedBy: new mongoose.Types.ObjectId(req.decodedToken.user._id),
  };
  if (country) query.country = country;
  const orders = await findAllOrdersWithUnreadMessages(query, page, pageSize);
  const counted = await countOrders(query);
  const endflag = Math.ceil(counted / pageSize) === req.body.page;
  if (orders) {
    return res.status(OK).json({
      msg: 'Orders message list found!',
      data: orders,
      endPages: endflag,
      count: counted,
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "Orders can't be retrieved",
  });
};

/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const getMyOrders = async (req, res) => {
  const page = +(req.body.page - 1);
  const pageSize = +req.body.pageSize;
  const options: any = {
    orderedBy: req.decodedToken.user._id,
  };
  if (req.body.filterObj) {
    if (req.body.filterObj.country) {
      options.country = req.body.filterObj.country;
    }
    if (req.body.filterObj.status) {
      options.status = req.body.filterObj.status;
    }
    if (req.body.filterObj.orderId) {
      options.orderID = req.body.filterObj.orderId;
    }
    if (req.body.filterObj.toDate && req.body.filterObj.fromDate) {
      options.createdAt = {
        $gte: req.body.filterObj.fromDate,
        $lt: req.body.filterObj.toDate,
      };
    }
    if (req.body.filterObj.hasIssue) {
      options.hasIssue = {
        $exists: true,
      };
    }
    if (!req.body.filterObj.showAllOrders) {
      if (!req.body.filterObj.isOrderVerified) {
        options.$and = [
          {
            status: {
              $nin: [
                'delivered',
                'return_verified',
                'replacement_verified',
                'order_addition',
                'taager_cancelled',
                'cancel',
                'delivery_suspended',
                'suspended',
                'customer_refused',
              ],
            },
          },
          { isOrderVerified: false },
        ];
      } else {
        options.$or = [
          {
            status: {
              $in: [
                'delivered',
                'return_verified',
                'replacement_verified',
                'order_addition',
                'taager_cancelled',
                'cancel',
                'delivery_suspended',
                'suspended',
                'customer_refused',
              ],
            },
          },
          { isOrderVerified: true },
        ];
      }
    }
  }
  const orders = await findMyOrders(options, page, pageSize);
  const counted = await countOrders(options);
  const endflag = Math.ceil(counted / pageSize) === req.query.page;

  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
    endPages: endflag,
    count: counted,
  });
};

/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const getAllMyOrders = async (req, res) => {
  const options: any = {
    orderedBy: req.decodedToken.user._id,
  };
  if (req.body.filterObj) {
    if (req.body.filterObj.country) {
      options.country = req.body.filterObj.country;
    }
    if (req.body.filterObj.status) {
      options.status = req.body.filterObj.status;
    }
    if (req.body.filterObj.orderId) {
      options.orderID = req.body.filterObj.orderId;
    }
    if (req.body.filterObj.toDate && req.body.filterObj.fromDate) {
      options.createdAt = {
        $gte: req.body.filterObj.fromDate,
        $lt: req.body.filterObj.toDate,
      };
    }
    if (!req.body.filterObj.showAllOrders) {
      options.isOrderVerified = req.body.filterObj.isOrderVerified;
    }
  }
  const orders = await findOrdersExtract(options);

  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
  });
};

/**
 *
 * @param {http request} req
 * @param {http response} res
 * @returns {Promise<http response>}
 */
export const searchInMyOrders = async (req, res) => {
  const page = +(req.body.page - 1);
  const pageSize = +req.body.pageSize;

  const options = {
    orderedBy: req.decodedToken.user._id,
    $or: [
      { country: req.body.filter },
      { receiverName: req.body.filter },
      { orderID: req.body.filter },
      { productIds: req.body.filter },
      { phoneNumber: req.body.filter },
      { phoneNumber2: req.body.filter },
    ],
  };
  const orders = await findAllMyOrdersWithPagination(options, page, pageSize);
  const counted = await countOrders(options);
  const endflag = Math.ceil(counted / pageSize) === req.query.page;

  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
    endPages: endflag,
    count: counted,
  });
};


