import express from 'express';
import isAuthenticated from '../middlewares/auth';
import { registerGet } from '../common/http/HttpHandler';
import { GetChildOrdersController } from '../order-management/queries/infrastructure/controllers/child-orders/GetChildOrdersController';
import { SearchInChildOrdersController } from '../order-management/queries/infrastructure/controllers/child-orders/SearchInChildOrdersController';
const router = express.Router();

registerGet('/', GetChildOrdersController, router, isAuthenticated);

registerGet('/search', SearchInChildOrdersController, router, isAuthenticated);

export = router;


