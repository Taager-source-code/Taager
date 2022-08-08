import express from 'express';
import errorHandler from 'express-async-handler';
import * as userWalletCtrl from '../merchant/commands/infrastrcuture/controllers/userWallet.controller';
import isAuthenticated from '../middlewares/auth';
import { registerGet } from '../common/http/HttpHandler';
import { ListWalletsController } from '../merchant/queries/infrastructure/wallet/ListWalletsController';
import AdminMiddleware from '../middlewares/AdminMiddleware';
const router = express.Router();

router.get('/viewMyWallet', isAuthenticated, errorHandler(userWalletCtrl.viewMyWallet));

router.post('/updateWalletByUserId', AdminMiddleware, errorHandler(userWalletCtrl.updateWalletByUserId));
registerGet('/', ListWalletsController, router, isAuthenticated);
export = router;


