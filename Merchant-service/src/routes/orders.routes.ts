// region requires

import express from 'express';

import errorHandler from 'express-async-handler';

import isAuthenticated from '../middlewares/auth';

import * as userOrdersSummaryController from '../order-management/queries/infrastructure/controllers/userOrdersSummary.controller';

import * as createOrderCtrl from '../order-management/commands/infrastructure/controllers/create-order/createOrder.controller';
import * as viewOrderCtrl from '../order-management/queries/infrastructure/controllers/view-order/viewOrder.controller';
import * as cancelOderCtrl from '../order-management/commands/infrastructure/controllers/cancel-order/cancelOrder.controller';
import * as updateOrderCtrl from '../order-management/commands/infrastructure/controllers/update-order/updateOrder.controller';
import * as getOrderCtrl from '../order-management/queries/infrastructure/controllers/retrieve-order/retrieveOrder.controller';
import CountryMiddleware from '../middlewares/CountryMiddleware';
import AdminMiddleware from '../middlewares/AdminMiddleware';
// endregion

const router = express.Router();

// I recommend moving all order endpoints into this file

router.get('/summary', isAuthenticated, errorHandler(userOrdersSummaryController.getUserOrdersSummaryHandler));

router.get(
  '/operations-rates',
  isAuthenticated,
  errorHandler(userOrdersSummaryController.getUserOperationsRatesHandler),
);

router.post('/makeOrderByCart', isAuthenticated, CountryMiddleware, errorHandler(createOrderCtrl.makeOrderByCart));

router.post(
  '/viewAllOrdersWithMessagesUser',
  isAuthenticated,
  errorHandler(viewOrderCtrl.viewAllOrdersWithMessagesUser),
);

router.post(
  '/viewOrdersWithUnreadMessages',
  isAuthenticated,
  errorHandler(viewOrderCtrl.viewOrdersWithUnreadMessagesUser),
);

router.post('/viewMyOrders', isAuthenticated, errorHandler(viewOrderCtrl.getMyOrders));

router.post('/viewMyOrdersExtract', isAuthenticated, errorHandler(viewOrderCtrl.getAllMyOrders));

router.post('/searchInMyOrders', isAuthenticated, errorHandler(viewOrderCtrl.searchInMyOrders));

router.patch('/cancelOrder', isAuthenticated, errorHandler(cancelOderCtrl.cancelOrder));

router.patch('/rateOrder', isAuthenticated, errorHandler(updateOrderCtrl.rateOrder));

router.get('/getReferralsOrders', isAuthenticated, errorHandler(getOrderCtrl.getReferralsOrders));

router.get('/orderId/:orderId', isAuthenticated, errorHandler(getOrderCtrl.getOrderByOrderId));

router.post('/getOrdersByUsers', isAuthenticated, AdminMiddleware, errorHandler(getOrderCtrl.getOrdersByUsers));

router.get('/getLastUpdatedOrders', isAuthenticated, AdminMiddleware, errorHandler(getOrderCtrl.getLastUpdatedOrders));

router.get('/getActiveBostaOrders', isAuthenticated, AdminMiddleware, errorHandler(getOrderCtrl.getActiveBostaOrders));

router.post('/getOrderActivityWithStatus', isAuthenticated, errorHandler(getOrderCtrl.getOrderActivityWithStatus));

router.post(
  '/calculate-cost',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(getOrderCtrl.getOrderFinancialBreakdown),
);

export = router;


