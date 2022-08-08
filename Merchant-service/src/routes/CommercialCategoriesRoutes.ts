import express from 'express';
import { registerGet } from '../common/http/HttpHandler';
import GetCommercialCategoryHierarchyController from '../content-management/queries/infrastructure/controllers/GetCommercialCategoryHierarchyController';
import countryMiddleware from '../middlewares/CountryMiddleware';
import isAuthenticated from '../middlewares/auth';

const router = express.Router();

registerGet('/hierarchy', GetCommercialCategoryHierarchyController, router, isAuthenticated, countryMiddleware);

export = router;


