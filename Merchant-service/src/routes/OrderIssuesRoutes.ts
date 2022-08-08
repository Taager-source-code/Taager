import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import * as orderIssuesCtrl from '../order-management/commands/infrastructure/controllers/orderIssues.controller';
const router = express.Router();

router.post('/addOrderRefund', isAuthenticated, errorHandler(orderIssuesCtrl.addOrderRefund));
router.post('/addOrderReplacement', isAuthenticated, errorHandler(orderIssuesCtrl.addOrderReplacement));
router.post('/addOrderCompletion', isAuthenticated, errorHandler(orderIssuesCtrl.addOrderCompletion));

router.post('/getOrderIssue', isAuthenticated, errorHandler(orderIssuesCtrl.getOrderIssue));

router.patch('/cancel', isAuthenticated, errorHandler(orderIssuesCtrl.cancelOrderDueToIssue));

router.post('/addIssueAttachment', isAuthenticated, errorHandler(orderIssuesCtrl.addImage));
export = router;


