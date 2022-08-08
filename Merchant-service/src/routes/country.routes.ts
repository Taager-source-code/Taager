// region requires
import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import * as GetSupportedCountriesController from '../shared-kernel/infrastructure/controllers/GetSupportedCountriesController';

// endregion

const router = express.Router();

router.get('/', isAuthenticated, errorHandler(GetSupportedCountriesController.execute));

export = router;


