import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import * as GetCategoriesController from '../content-management/queries/infrastructure/controllers/getCategoriesController';
import CountryMiddleware from '../middlewares/CountryMiddleware';

const router = express.Router();

router.get('/getCategories', isAuthenticated, CountryMiddleware, errorHandler(GetCategoriesController.execute));

export = router;


