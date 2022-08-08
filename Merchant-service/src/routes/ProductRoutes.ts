// region requires
import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import CountryMiddleware from '../middlewares/CountryMiddleware';
import * as productCtrl from '../content-management/queries/application/usecases/product/product.controller';
import * as favouriteProductsCtrl from '../merchant/queries/application/usecases/favouriteProducts.controller';
import { registerGet, registerPost } from '../common/http/HttpHandler';
import GetVariantGroupByIdController from '../content-management/queries/infrastructure/controllers/variant/GetVariantGroupByIdController';
import GetVariantGroupByVariantIdController from '../content-management/queries/infrastructure/controllers/variant/GetVariantGroupByVariantIdController';
import SearchVariantGroupsController from '../content-management/queries/infrastructure/controllers/variant/SearchVariantGroupsController';
// endregion

const router = express.Router();

//region APIs

router.get('/product/viewProduct/:id', isAuthenticated, CountryMiddleware, errorHandler(productCtrl.viewProduct));

router.post('/product/getProductsByIds', isAuthenticated, errorHandler(productCtrl.getProductsByIds));
router.post('/product/getProductsByProdIds', isAuthenticated, errorHandler(productCtrl.getProductsByProdIds));

router.patch(
  '/product/favourite/:id/set',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(favouriteProductsCtrl.setFavouriteProduct),
);
router.patch(
  '/product/favourite/:id/unset',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(favouriteProductsCtrl.unsetFavouriteProduct),
);

router.get(
  '/product/favourite',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(favouriteProductsCtrl.favouriteProductsList),
);

router.get(
  '/product/favourite/:id',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(favouriteProductsCtrl.isProductFavourite),
);

router.patch(
  '/product/favourite/:id',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(favouriteProductsCtrl.updateProductPrice),
);

router.post('/product/request', isAuthenticated, errorHandler(productCtrl.requestProduct));

registerGet('/variantGroup/:id', GetVariantGroupByIdController, router, isAuthenticated, CountryMiddleware);

registerGet(
  '/variantGroup/variant/:id',
  GetVariantGroupByVariantIdController,
  router,
  isAuthenticated,
  CountryMiddleware,
);

registerPost('/variantGroups/search', SearchVariantGroupsController, router, isAuthenticated, CountryMiddleware);

//endregion

export = router;


