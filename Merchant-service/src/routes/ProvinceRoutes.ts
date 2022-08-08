// region requires
import express from 'express';
import isAuthenticated from '../middlewares/auth';
import CountryMiddleware from '../middlewares/CountryMiddleware';
import { GetProvincesController } from '../order-management/queries/infrastructure/controllers/province/GetProvincesController';
import { GetProvincesPaginatedController } from '../order-management/queries/infrastructure/controllers/province/GetProvincesPaginatedController';
import { registerGet } from '../common/http/HttpHandler';
// endregion

const router = express.Router();

registerGet('/getProvinces', GetProvincesController, router, isAuthenticated, CountryMiddleware);

registerGet('/viewProvinces', GetProvincesPaginatedController, router, isAuthenticated, CountryMiddleware);

export = router;


