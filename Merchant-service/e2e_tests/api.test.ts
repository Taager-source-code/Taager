import CountryModel from '../src/shared-kernel/infrastructure/db/models/CountrySchema';

jest.mock('../src/authentication/commands/application/usecases/auth.service');
jest.mock('../src/shared-kernel/infrastructure/toggles/activeFeatureToggles');
jest.mock('../src/shared-kernel/infrastructure/config/Log');

import { when } from 'jest-when';
import * as authService from '../src/authentication/commands/application/usecases/auth.service';
import { GenericContainer } from 'testcontainers';
import VariantGroup from '../src/content-management/queries/infrastructure/db/schemas/VariantGroupModel';
import Product from '../src/content-management/queries/infrastructure/db/schemas/ProductModel';
import Cart from '../src/order-management/common/infrastructure/db/schemas/cart.model';
import Catalog from '../src/merchant/common/infrastructure/db/schemas/favouriteProducts.model';
import express from 'express';
import request from 'supertest';
import User from '../src/merchant/common/infrastructure/db/schemas/user.model';
import Province from '../src/order-management/common/infrastructure/db/schemas/ProvinceSchema';
import UserPoints from '../src/merchant/common/infrastructure/db/schemas/userPoints.model';
import IncentiveProgramModel from './../src/incentive-program/infrastructure/models/mongodb/IncentiveProgram.model';
import UserFeatureModel from '../src/merchant/common/infrastructure/db/schemas/userFeatures.model';
import { mocked } from 'ts-jest/utils';
import * as activeToggles from '../src/shared-kernel/infrastructure/toggles/activeFeatureToggles';
import 'reflect-metadata';
process.env.SNOWFLAKE_MOCK_ENABLED = 'true';
process.env.FREE_SHIPPING_THRESHOLD = '400';
import {
  connectDefaultConnectionToMongoDB,
  createNonDefaultMongoConnection,
  disconnectDefaultFromMongoDB,
  disconnectNonDefaultFromMongoDB,
} from '../src/shared-kernel/infrastructure/config/mongoose';
import serverRoutes from '../src/routes';
import ordersRoutes from '../src/routes/orders.routes';
import merchantsRoutes from '../src/routes/merchants.routes';
import productRoutes from '../src/routes/ProductRoutes';
import {
  aVariant,
  XL_L_SIZE_SET,
  XL_SIZE,
} from '../src/content-management/common/infrastructure/db/product.testing.fixture';
import { ProvinceModel } from '../src/order-management/common/infrastructure/db/models/ProvinceModel';
import { countryFixture } from './fixtures/countryFixture';
import { secondaryConnection } from '../src/shared-kernel/infrastructure/config/mongoose-secondary';

const authServiceMocked = mocked(authService, true);

const USER_ID = '507f191e810c19729de860ea';
const TAAGER_ID = 5;
const USERNAME = 'superCoolUser';

const setUpToggleForFreeShipping = value => {
  when(activeToggles.isShippingDiscountEnabled)
    .calledWith(TAAGER_ID)
    .mockReturnValue(value);
};
function setupServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api', serverRoutes);
  app.use('/api/order', ordersRoutes);
  app.use('/api/merchant', merchantsRoutes);
  app.use('/api', productRoutes);
  return app;
}

async function addUserFeature(tagerId, feature) {
  await UserFeatureModel.create({
    tagerIds: tagerId,
    feature,
  });
}

async function removeUserFeature(tagerId, feature) {
  await UserFeatureModel.remove({
    tagerIds: tagerId,
    feature,
  });
}

async function createDefaultIncentiveProgram() {
  await IncentiveProgramModel.create({
    name: 'Default Program',
    default: true,
    active: true,
    target: 10,
    incentiveProgramType: 'limited',
    milestones: [
      { targetPercentage: 20, rewardValuePerOrder: 3 },
      { targetPercentage: 50, rewardValuePerOrder: 5 },
      { targetPercentage: 90, rewardValuePerOrder: 10 },
      { targetPercentage: 100, rewardValuePerOrder: 15 },
    ],
  });
}
async function createIncentiveProgramWithoutType() {
  await IncentiveProgramModel.create({
    name: 'Default Program',
    default: true,
    active: true,
    target: 10,
    milestones: [
      { targetPercentage: 20, rewardValuePerOrder: 3 },
      { targetPercentage: 50, rewardValuePerOrder: 5 },
      { targetPercentage: 90, rewardValuePerOrder: 10 },
      { targetPercentage: 100, rewardValuePerOrder: 15 },
    ],
  });
}

async function createVariantGroup(id, country = 'EGY') {
  const createdProduct = await Product.create(aVariant(id, [XL_SIZE], country));
  const variantGroup = {
    attributeSets: [XL_L_SIZE_SET],
    variants: [createdProduct._id],
    primaryVariant: createdProduct._id,
    name: 'name',
    country: country,
  };
  const createdVariantGroup = await VariantGroup.create(variantGroup);
  return {
    variantGroup: createdVariantGroup,
    variant: createdProduct,
  };
}

async function constructCartAndCatalog() {
  const prodId6 = await createVariantGroup(Math.random().toString());
  const prodId7 = await createVariantGroup(Math.random().toString());
  const prodId8 = await createVariantGroup(Math.random().toString());

  const cartProducts = [
    { qty: 3, product: prodId6.variant._id, preferredMerchantPrice: 300 },
    { qty: 5, product: prodId7.variant._id, preferredMerchantPrice: 310 },
    { qty: 7, product: prodId8.variant._id, preferredMerchantPrice: 320 },
  ];

  const catalogProductOne = {
    _id: prodId6.variant._id,
  };
  return {
    cartProducts,
    catalogProduct: catalogProductOne,
  };
}

async function callAddToCartAPI(app: any, products: { preferredMerchantPrice: number; product; qty: number }[]) {
  await request(app)
    .patch('/api/user/addToCart')
    .send({
      productId: products[0].product,
      quantity: products[0].qty,
    });
  await request(app)
    .patch('/api/user/addToCart')
    .send({
      productId: products[1].product,
      quantity: products[1].qty,
    });
  await request(app)
    .patch('/api/user/addToCart')
    .send({
      productId: products[2].product,
      quantity: products[2].qty,
    });
}

async function callAddToCatalogAPI(app, catalogProduct) {
  return request(app).patch(`/api/product/favourite/${catalogProduct._id}/set`);
}

describe('APIs', () => {
  let container;
  let app: any = null;
  let firstVariant;
  let secondVariant;

  async function createUser(loyaltyProgram) {
    await User.create({
      _id: USER_ID,
      TagerID: TAAGER_ID,
      fullName: 'Test Person',
      firstName: 'Test',
      lastName: 'Person',
      username: 'tperson',
      loyaltyProgram,
      userLevel: 1,
    });
  }

  const provinceModel: ProvinceModel = {
    _id: '507f191e810c19729de860ab',
    location: 'province',
    branch: 'Alex',
    shippingRevenue: 25,
    shippingCost: 40,
    minETA: 2,
    maxETA: 3,
    isActive: true,
    country: 'EGY',
  };

  async function createVariantGroup(id, country = 'EGY') {
    const createdProduct = await Product.create(aVariant(id, [XL_SIZE], country));
    const variantGroup = {
      attributeSets: [XL_L_SIZE_SET],
      variants: [createdProduct._id],
      primaryVariant: createdProduct._id,
      name: 'name',
      country: country,
    };
    const createdVariantGroup = await VariantGroup.create(variantGroup);
    return {
      variantGroup: createdVariantGroup,
      variant: createdProduct,
    };
  }
  async function createVariantGroups() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ variant: firstVariant } = await createVariantGroup('1D'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ variant: secondVariant } = await createVariantGroup('2D'));
    await createVariantGroup('3D');
  }

  async function createProvince() {
    await Province.create(provinceModel);
  }
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  beforeAll(async () => {
    container = await new GenericContainer('mongo').withExposedPorts(27017).start();

    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/bla`;

    await connectDefaultConnectionToMongoDB(mongoUri);
    await createNonDefaultMongoConnection(secondaryConnection, mongoUri);
    app = setupServer();
    await createUser('GOLD');
    await createVariantGroups();
    await createProvince();
    await createCountries();
  });

  beforeEach(async () => {
    setUpToggleForFreeShipping(true);
    authServiceMocked.isAuthenticated.mockImplementation(() => {
      return Promise.resolve({
        user: {
          _id: USER_ID,
          TagerID: TAAGER_ID,
          username: USERNAME,
          userLevel: 1,
        },
      });
    });
  });

  describe('User apis', () => {
    const addUserLoyaltyPoints = async () => {
      await UserPoints.create({
        pointsCount: 101,
        userId: USER_ID,
        active: true,
        dateNumber: '01012000', // Y2K yees
      });
    };
    test('profile update flow', async () => {
      // Arrange
      await addUserLoyaltyPoints();
      // Act
      const updateResponse = await request(app)
        .patch('/api/user/updateProfile')
        .send({
          firstName: 'SuperTest',
          lastName: 'SuperPerson',
          phoneNum: '01000000000',
          email: 'test.person@taager.com',
        });
      // Assert
      expect(updateResponse.statusCode).toEqual(200);
      const responseBody = updateResponse.body;
      expect(responseBody.data.firstName).toEqual('SuperTest');
      expect(responseBody.data.lastName).toEqual('SuperPerson');
      expect(responseBody.data.phoneNum).toEqual('01000000000');
      expect(responseBody.data.email).toEqual('test.person@taager.com');
      expect(responseBody.data.loyaltyProgram.loyaltyProgram).toEqual('GOLD');
      expect(responseBody.data.loyaltyProgram.points).toEqual(101);
    });
  });
  describe('Merchant APIs', () => {
    test('test success scenario', async () => {
      // Arrange
      await addUserFeature(TAAGER_ID, 'incentive_program');
      await createDefaultIncentiveProgram();
      const response = await request(app).get('/api/merchant/incentive-program');
      // Assert
      expect(response.statusCode).toEqual(200);
    });
    test('test failed scenario', async () => {
      // Arrange
      await removeUserFeature(TAAGER_ID, 'incentive_program');
      const response = await request(app).get('/api/merchant/incentive-program');
      // Assert
      expect(response.statusCode).toEqual(404);
    });
    test('test success scenario with program has no type', async () => {
      // Arrange
      await addUserFeature(TAAGER_ID, 'incentive_program');
      await createIncentiveProgramWithoutType();
      const response = await request(app).get('/api/merchant/incentive-program');
      // Assert
      expect(response.statusCode).toEqual(200);
    });
  });
  describe('/api/user', () => {
    describe('/getCart', () => {
      test('200', async () => {
        // Arrange
        const { cartProducts } = await constructCartAndCatalog();
        await callAddToCartAPI(app, cartProducts);

        // Act
        const cartResponse = await request(app).get('/api/user/getCart');

        // Assert
        expect(cartResponse.statusCode).toEqual(200);
        const responseBody = cartResponse.body;
        expect(responseBody.data).toHaveLength(3);
      });
    });
  });

  describe('/api/merchant', () => {
    describe('/shopping-summary', () => {
      test('200', async () => {
        // Arrange
        const { cartProducts, catalogProduct } = await constructCartAndCatalog();
        await callAddToCatalogAPI(app, catalogProduct);
        await callAddToCartAPI(app, cartProducts);

        // Act
        const merchantShoppingSummaryResult = await request(app).get('/api/merchant/shopping-summary');

        // Assert
        const merchantShoppingSummary = merchantShoppingSummaryResult.body.merchantShoppingSummary;

        expect(merchantShoppingSummaryResult.statusCode).toEqual(200);
        expect(merchantShoppingSummary.cartCount).toEqual(15);
        expect(merchantShoppingSummary.catalogCount).toEqual(1);
      });
    });
  });

  afterEach(async () => {
    await Cart.deleteMany({});
    await Catalog.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    await disconnectNonDefaultFromMongoDB(secondaryConnection);
    container.stop();
  });
});


