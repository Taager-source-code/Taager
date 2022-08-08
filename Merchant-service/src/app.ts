import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import 'reflect-metadata';
import promBundle from 'express-prom-bundle';
import status from 'http-status';

import dotenv from 'dotenv';

dotenv.config();

// Required to execute before routes are loaded
require('newrelic');

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './../swagger/swagger.json';

import HttpLogger from './middlewares/HttpLogger';

import Logger from './shared-kernel/infrastructure/logging/general.log';
import routes from './routes';

import ordersRoutes from './routes/orders.routes';
import childOrderRoutes from './routes/ChildOrderRoutes';
import merchantRoutes from './routes/merchants.routes';
import countryRoutes from './routes/country.routes';
import categoryRoutes from './routes/categories.routes';
import announcementRoutes from './routes/announcement.routes';
import notificationRoutes from './routes/NotificationRoutes';
import healthCheckRoute from './routes/healthcheck.routes';
import productRoutes from './routes/ProductRoutes';
import walletRoutes from './routes/WalletRoutes';
import withdrawalsRoutes from './routes/WithdrawlsRoutes';
import orderIssuesRoutes from './routes/OrderIssuesRoutes';
import provinceRoutes from './routes/ProvinceRoutes';
import commercialCategoryRoutes from './routes/CommercialCategoriesRoutes';
import questionnaireRoutes from './routes/QuestionnaireRoutes';

const app = express();
app.use(HttpLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }),
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.disable('etag');

const notApiPathRegexp = new RegExp('^((?!/api)).*$', 'g'); // Exclude everything not on /api path
const userByReferralPathRegexp = new RegExp('^/api/auth/getUserByReferralCode/.*$', 'g'); // Exclude this path
app.use(
  promBundle({
    buckets: [0.01, 0.05, 0.1, 0.15, 0.25, 0.5, 0.7, 1, 2, 3, 5, 10, 30, 60],
    includePath: true,
    includeMethod: true,
    promClient: {
      collectDefaultMetrics: {},
    },
    excludeRoutes: [notApiPathRegexp, userByReferralPathRegexp],
    urlValueParser: { extraMasks: ['%'] },
  }),
);

app.use('/api/order', ordersRoutes);
app.use('/api/child-order', childOrderRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/commercial-categories', commercialCategoryRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/province', provinceRoutes);
app.use('/api', productRoutes);
app.use('/api', withdrawalsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/orderIssues', orderIssuesRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api', routes);
app.use('/healthcheck', healthCheckRoute);

// Logic Error Handler
// next MUST exist for middleware to trigger
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  Logger.error(`Error handler triggered: ${JSON.stringify(err)}`);
  res.status(err.statusCode || status.INTERNAL_SERVER_ERROR).json({
    // @ts-ignore
    msg: err.msg || status[status.INTERNAL_SERVER_ERROR],
  });
});

app.use((req, res) => {
  res.status(status.NOT_FOUND).json({
    msg: status[status.NOT_FOUND],
  });
});

export = app;


