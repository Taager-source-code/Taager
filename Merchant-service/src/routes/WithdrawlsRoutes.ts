// region requires
import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import * as paymentRequestCtrl from '../../src/merchant/commands/infrastrcuture/controllers/paymentRequest.controller';
import { registerPost } from '../common/http/HttpHandler';
import { ListWithdrawalsController } from '../merchant/queries/infrastructure/withdrawals/controllers/ListWithdrawalsController';
import RequestWithdrawalController from '../merchant/commands/infrastrcuture/withdrawals/controllers/RequestWithdrawalController';

const router = express.Router();

//HINT: this is used by the scheduled service
router.post(
  '/payment/getPaymentRequestsByUser',
  isAuthenticated,
  errorHandler(paymentRequestCtrl.getPaymentRequestsByUser),
);

router.get('/payment/getMyPaymentRequests', isAuthenticated, errorHandler(paymentRequestCtrl.viewMyPaymentRequest));

router.post('/payment/createPaymentRequest', isAuthenticated, errorHandler(paymentRequestCtrl.addPaymentRequest));

// region new APIs
registerPost('/withdrawals/request', RequestWithdrawalController, router, isAuthenticated);

registerPost('/withdrawals/list', ListWithdrawalsController, router, isAuthenticated);
// endregion
export = router;


