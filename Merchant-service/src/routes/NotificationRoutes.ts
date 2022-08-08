// region requires
import express from 'express';
import isAuthenticated from '../middlewares/auth';
import CountryMiddleware from '../middlewares/CountryMiddleware';
import { registerPost } from '../common/http/HttpHandler';
import { MarkNotificationsAsReadController } from '../engagement/notifications/commands/infrastructure/controllers/MarkNotificationsAsReadController';
import { GetMerchantNotificationsController } from '../engagement/notifications/queries/infrastructure/controllers/GetMerchantNotificationsController';
import { registerGet } from '../common/http/HttpHandler';
// endregion

const router = express.Router();

registerGet('/taager', GetMerchantNotificationsController, router, isAuthenticated, CountryMiddleware);

registerPost('/markAsRead', MarkNotificationsAsReadController, router, isAuthenticated);

export = router;


