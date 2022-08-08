import express from 'express';
import errorHandler from 'express-async-handler';
import isAuthenticated from '../middlewares/auth';
import CountryMiddleware from '../middlewares/CountryMiddleware';
import isNotAuthenticated from '../middlewares/no-auth';
import upload from '../middlewares/upload';
import * as authCtrl from '../authentication/commands/infrastructure/controllers/auth/auth.controller';
import * as userCtrl from '../merchant/commands/infrastrcuture/controllers/user.controller';
import * as feedbackCtrl from '../merchant/commands/infrastrcuture/controllers/feedback.controller';
import * as userPointsCtrl from '../merchant/commands/infrastrcuture/controllers/userPoints.controller';
import * as userFeaturesCtrl from '../merchant/commands/infrastrcuture/controllers/userFeatures.controller';
import * as complainsSuggestionsCtrl from '../merchant/commands/infrastrcuture/controllers/complainsSuggestions.controller';
import * as surveyCtrl from '../merchant/commands/infrastrcuture/controllers/survey.controller';
import * as featuredProductsGroupCtrl from '../content-management/queries/infrastructure/controllers/featuredProductsGroup.controller';
import * as shippingCtrl from '../order-management/commands/infrastructure/controllers/shipping.controller';
import AddToCartController from '../merchant/commands/infrastrcuture/controllers/cart/AddToCartController';
import { registerPatch } from '../common/http/HttpHandler';
import AddToCartWithCustomPriceController from '../merchant/commands/infrastrcuture/controllers/cart/AddToCartWithCustomPriceController';

const router = express.Router();

// -------------------------------Auth------------------------------------------
router.post('/auth/register', isNotAuthenticated, errorHandler(authCtrl.register));
router.post('/auth/socialAuthSignIn', isNotAuthenticated, errorHandler(authCtrl.socialAuthSignIn));
router.post('/auth/login', isNotAuthenticated, errorHandler(authCtrl.login));
router.post('/auth/wallet-login', isAuthenticated, errorHandler(authCtrl.walletLogin));

router.patch('/auth/resendVerificationEmail', errorHandler(authCtrl.resendVerificationEmail));
router.patch('/auth/verifyAccount/:verificationToken', errorHandler(authCtrl.verifyAccount));
router.patch('/auth/forgotPassword', isNotAuthenticated, errorHandler(authCtrl.forgotPassword));
router.patch('/auth/forgotWalletPassword', isAuthenticated, errorHandler(authCtrl.forgotWalletPassword));
router.get(
  '/auth/checkResetPasswordToken/:resetPasswordToken',
  isNotAuthenticated,
  errorHandler(authCtrl.checkResetPasswordToken),
);
router.get('/auth/getUserByReferralCode/:id', errorHandler(authCtrl.getUserByReferralCode));

router.patch(
  '/auth/resetPassword/:userId/:resetPasswordToken',
  isNotAuthenticated,
  errorHandler(authCtrl.resetPassword),
);
router.patch(
  '/auth/resetWalletPassword/:userId/:resetWalletPasswordToken',
  isAuthenticated,
  errorHandler(authCtrl.resetWalletPassword),
);
router.patch('/auth/changePassword', isAuthenticated, errorHandler(authCtrl.changePassword));
router.patch('/auth/changeWalletPassword', isAuthenticated, errorHandler(authCtrl.changeWalletPassword));
router.post('/auth/updatePic', isAuthenticated, errorHandler(authCtrl.updatePic));

// ----------------------------------User-------------------------------------
router.patch('/user/updateProfile', isAuthenticated, errorHandler(userCtrl.updateProfile));
router.patch('/user/updateProfileDeviceTokens', isAuthenticated, errorHandler(userCtrl.updateProfileDeviceTokens));
router.patch('/user/setFreshChatRestoreId', isAuthenticated, errorHandler(userCtrl.setFreshChatRestoreId));

router.get('/user/getAllActiveUsers', errorHandler(userCtrl.getAllActiveUsers));

router.post('/user/generateReferralCode', isAuthenticated, errorHandler(authCtrl.generateReferralCode));
router.patch(
  '/user/changeProfilePicture',
  isAuthenticated,
  upload('profilePictures', ['image']),
  errorHandler(userCtrl.changeProfilePicture),
);
router.get('/user/viewOwnProfile', isAuthenticated, errorHandler(userCtrl.viewOwnProfile));
router.get('/user/getCart', isAuthenticated, CountryMiddleware, errorHandler(userCtrl.getCart));
router.get('/user/getUserByTaagerId/:id', isAuthenticated, errorHandler(userCtrl.getUserByTaagerId));
registerPatch(
  '/user/addToCart/:pid/:sellerName/:qty/:overwriteQuantity',
  AddToCartController,
  router,
  isAuthenticated,
  CountryMiddleware,
);
registerPatch('/user/addToCart', AddToCartWithCustomPriceController, router, isAuthenticated, CountryMiddleware);
// Deprecated - removeFromCart/:pid/:sellerName
router.patch(
  '/user/removeFromCart/:pid/:sellerName',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(userCtrl.removeFromCart),
);
router.patch('/user/removeFromCart/:pid', isAuthenticated, CountryMiddleware, errorHandler(userCtrl.removeFromCart));

router.get('/user/getUserLevel', isAuthenticated, errorHandler(userCtrl.getUserLevel));

router.post('/user/updateLoyaltyProgram', errorHandler(userCtrl.updateLoyaltyProgram));

router.get('/user/getUserLoyaltyProgram', isAuthenticated, errorHandler(userCtrl.getUserLoyaltyProgram));

// ---------------------------------Feedback--------------------------------------
router.get('/feedback/viewFeedback', isAuthenticated, errorHandler(feedbackCtrl.viewFeedback));
router.post('/feedback/CreateFeedback', errorHandler(feedbackCtrl.CreateFeedback));

// ---------------------------------UserPoints--------------------------------------

router.post('/userPoints/expireUserPoints', errorHandler(userPointsCtrl.expireUserPoints));

router.get('/userPoints/findAllActiveUserPoints', errorHandler(userPointsCtrl.findAllActiveUserPoints));

router.get('/userPoints/findUserPointsByUserId/:id', errorHandler(userPointsCtrl.findUserPointsByUserId));

// ---------------------------------UserFeatures--------------------------------------
router.get('/userFeatures/getAllUserFeatures', isAuthenticated, errorHandler(userFeaturesCtrl.viewAllUserFeatures));

router.get(
  '/userFeatures/getTagerIdsbyFeature/:feature',
  isAuthenticated,
  errorHandler(userFeaturesCtrl.getTagerIdsbyFeature),
);

router.post('/userFeatures/addUserFeatures', isAuthenticated, errorHandler(userFeaturesCtrl.addUserFeatures));

router.patch(
  '/userFeatures/updateUserFeatures/:id',
  isAuthenticated,
  errorHandler(userFeaturesCtrl.updateUserFeatures),
);

router.delete(
  '/userFeatures/deleteUserFeatures/:id',
  isAuthenticated,
  errorHandler(userFeaturesCtrl.deleteUserFeatures),
);
// ---------------------------------Shipping--------------------------------------

router.post('/shipping/trackBostaOrder', isAuthenticated, errorHandler(shippingCtrl.trackBostaOrder));

router.post('/shipping/aramex-track', isAuthenticated, errorHandler(shippingCtrl.trackOrderFromAramex));

router.post('/shipping/vhubs-track', isAuthenticated, errorHandler(shippingCtrl.trackOrderFromVHubs));

// ---------------------------------Complains and Suggestions--------------------------------------
router.post(
  '/complains-suggestions',
  isAuthenticated,
  errorHandler(complainsSuggestionsCtrl.createComplainOrSuggestion),
);

// --------------------------------- Survey --------------------------------------

router.get('/survey', isAuthenticated, errorHandler(surveyCtrl.viewSurvey));
router.patch('/survey/:_id/skip', isAuthenticated, errorHandler(surveyCtrl.skipSurvey));
router.patch('/survey/:_id/answer', isAuthenticated, errorHandler(surveyCtrl.answerSurvey));

// --------------------------------- -------- --------------------------------------
router.get(
  '/featuredProductsGroup/:type',
  isAuthenticated,
  CountryMiddleware,
  errorHandler(featuredProductsGroupCtrl.getFeaturedProductsGroup),
);

export = router;


