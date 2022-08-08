// region requires
import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import * as GetAnnouncementsController from '../content-management/queries/infrastructure/controllers/GetAnnouncementsController';
import CountryMiddleware from '../middlewares/CountryMiddleware';
// endregion

const router = express.Router();

router.get('/getAnnouncements', isAuthenticated, CountryMiddleware, errorHandler(GetAnnouncementsController.execute));

export = router;


