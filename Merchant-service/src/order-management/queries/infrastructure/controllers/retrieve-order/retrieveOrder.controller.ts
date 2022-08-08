import { UNAUTHORIZED, OK, NOT_FOUND, UNPROCESSABLE_ENTITY, CONFLICT } from 'http-status';

import { findUserById, findUsers } from '../../../../../merchant/queries/application/usecases/user.service';
import {
  countOrders,
  findAllMyOrders,
  findAllOrdersByUsers,
  findAllOrdersCustomer,
  findMyOrder,
} from '../../../application/usecases/order.service';
import {
  findAllOrderActivitiesUser,
  findAllOrderActivities,
  countOrderActivity,
} from '../../../../commands/application/usecases/orderActivity.service';
import {
  getService,
  deleteService,
  addNewService,
} from '../../../../../merchant/commands/application/usecases/services.service';

import { designatedUserLevel } from '../../../../../authentication/commands/domain/models/userLevel';
import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { validateOrderCostCalculationRequest } from './retrieveOrder.validator';
import { retrieveOrderFinancialBreakdown } from '../../../../commands/application/usecases/orderDetails.service';
import { InvalidProvinceError, TooLowProductPriceError } from '../../../../commands/domain/order.errors';
import ProductNotFoundError from '../../../../../content-management/commands/domain/exceptions/product.errors';
import { REFUND_VERIFIED } from '../../../../common/domain/models/OrderStatuses';

/**
 * getReferralsOrders
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getReferralsOrders = async (req, res) => {
  let counted;
  let totalCount = 0;
  let options: any = {
    referredBy: req.decodedToken.user._id,
  };
  const users = await findUsers(options);
  // eslint-disable-next-line no-restricted-syntax
  for await (const el of users) {
    options = {
      orderedBy: el._id,
    };
    counted = await countOrders(options);
    totalCount += counted;
  }

  return res.status(OK).json({
    msg: 'Orders found!',
    countUsers: users.length,
    countOrders: totalCount,
  });
};

/**
 * getOrderByOrderId returns orders by OrderId
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getOrderByOrderId = async (req, res) => {
  const order = await findMyOrder(req.params.orderId, req.decodedToken.user.TagerID);
  if (!order) {
    return res.status(NOT_FOUND).json({
      msg: "Looks like this order doesn't exist!",
    });
  }
  return res.status(OK).json({
    msg: 'Order found!',
    data: order,
  });
};

/**
 * getOrdersByUsers
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getOrdersByUsers = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (user.userLevel !== 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const options = {
    orderedBy: {
      $in: req.body.userIdsArray,
    },
    $or: [
      { status: { $in: ['delivered', 'done', 'Done', REFUND_VERIFIED] } },
      {
        $and: [
          {
            status: {
              $in: ['replacement_verified', 'order_addition', 'replacement_in_progress', 'order_addition_inprogress'],
            },
          },
          { createdAt: { $gte: new Date('2021-01-15T00:00:00Z') } },
        ],
      },
    ],
  };
  const orders = await findAllOrdersByUsers(options);
  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
  });
};

/**
 * getLastUpdatedOrders
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getLastUpdatedOrders = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (user.userLevel !== 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  let options = {};
  const service = await getService({ serviceName: 'walletService' });
  if (service) {
    options = {
      updatedAt: { $gte: service[0].maxUpdatedAt },
      status: {
        $in: [
          'delivered',
          'replacement_verified',
          'order_addition',
          'replacement_in_progress',
          'order_addition_inprogress',
          'refund_in_progress',
          'refund_verified',
          'return_in_progress',
          'return_verified',
        ],
      },
    };
  }

  const orders = await findAllOrdersCustomer(options);
  if (orders) {
    const query = {
      serviceName: service[0].serviceName,
    };
    await deleteService(query);
    await addNewService({
      serviceName: service[0].serviceName,
      maxUpdatedAt: orders[0].updatedAt,
    });
  }
  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
  });
};

/**
 * getActiveBostaOrders
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getActiveBostaOrders = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (user.userLevel !== 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const dt = new Date();
  dt.setDate(dt.getDate() - 15);
  const statusArray = [
    'pending_shipping_company',
    'delayed',
    'delivery_in_progress',
    'delivered',
    'return_in_progress',
    'delivery_suspended',
    'return_verified',
    'replacement_in_progress',
    'replacement_verified',
  ];
  const options = {
    status: {
      $in: statusArray,
    },
    isOrderVerified: false,
    'shippingInfo.company': 'bosta',
    createdAt: {
      $gte: dt,
    },
  };
  const orders = await findAllMyOrders(options);

  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
  });
};

/**
 * getOrderActivityWithStatus
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getOrderActivityWithStatus = async (req, res) => {
  const pageSize = +req.body.pageSize;
  const options: any = {};
  if (req.body.filterObj) {
    if (req.body.filterObj.orderStatus) {
      options.orderStatus = req.body.filterObj.orderStatus;
    }
    if (req.body.filterObj.orderID) {
      options.orderID = req.body.filterObj.orderID;
    }
  }
  let orders;
  const user = await findUserById(req.decodedToken.user._id);
  if (user.userLevel !== designatedUserLevel.ADMIN_USER) {
    orders = await findAllOrderActivitiesUser(options); // , page, pageSize);
  } else {
    orders = await findAllOrderActivities(options); // , page, pageSize);
  }
  const counted = await countOrderActivity(options);
  const endflag = Math.ceil(counted / pageSize) === req.query.page;

  return res.status(OK).json({
    msg: 'Orders found!',
    data: orders,
    endPages: endflag,
    count: counted,
  });
};

function handleSuccess(orderFinancials, res) {
  res.status(OK).json({ data: orderFinancials });
}

function handleError(error, res) {
  if (error instanceof InvalidProvinceError) {
    Logger.error(`getOrderActivityWithStatus: ${error.stack}`);
    res.status(CONFLICT).json({
      msg: 'Province does not exist in database',
      province: [error.province],
    });
  } else if (error instanceof TooLowProductPriceError) {
    Logger.error(`getOrderActivityWithStatus: ${error.stack}`);
    res.status(CONFLICT).json({
      msg: 'Product can not be sold at a lower price compared to its base price',
      data: {
        product: error.product,
        orderPrice: error.orderPrice,
      },
    });
  } else if (error instanceof ProductNotFoundError) {
    Logger.error(`getOrderActivityWithStatus: ${error.stack}`);
    res.status(CONFLICT).json({
      msg: error.message,
    });
  } else {
    throw error;
  }
}

/**
 * @description getOrderFinancialBreakdown return shipping cost and free delivery status
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export const getOrderFinancialBreakdown = async (req, res) => {
  const { error, value: orderCostBreakdown } = validateOrderCostCalculationRequest(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  const tagerId = req.decodedToken.user.TagerID;
  Logger.debug('Request for calculating order cost received');
  try {
    const orderFinancials = await retrieveOrderFinancialBreakdown(
      orderCostBreakdown,
      tagerId,
      req.country.countryIsoCode3,
    );
    handleSuccess(orderFinancials, res);
  } catch (error) {
    handleError(error, res);
  }
};


