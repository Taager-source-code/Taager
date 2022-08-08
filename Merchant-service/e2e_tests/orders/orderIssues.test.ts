process.env.SECRET = 'yallahabibi';
process.env.FREE_SHIPPING_THRESHOLD = '400';
import { registerAndLogin, setupServer } from '../expressServer/expressServer';
import request from 'supertest';

import { MONGO_PORT, MongoDockerContainer } from '../mongo/docker.mongo';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture } from '../fixtures/countryFixture';
import { ProductBuilder } from '../fixtures/product.fixture';
import { CREATED, OK } from 'http-status';
import Product from '../../src/content-management/queries/infrastructure/db/schemas/ProductModel';
import ProvinceModel from '../../src/order-management/common/infrastructure/db/schemas/ProvinceSchema';
import {
  findUserWallet,
  findUserWalletByIdAndUpdate,
} from '../../src/merchant/commands/application/usecases/userWallet.service';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('../../src/shared-kernel/infrastructure/toggles/activeFeatureToggles');

jest.mock('../../src/shared-kernel/infrastructure/config/Log');
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

jest.mock('multer', () => () => {
  return {
    single: () => (req, res) => {
      return res.status(OK).json({
        msg: 'DummyFileLocation',
      });
    },
  };
});
jest.mock('multer-s3', () => () => jest.fn());

describe('/orderIssues API endpoints', () => {
  let app: any = null;
  let accessToken_user01: string;
  let user_id_user01: string;

  // TODO: Refactor functions so that its commonly used amongst tests
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };
  const makeOrder = (sentOrder, accessToken, country) => {
    return request(app)
      .post('/api/order/makeOrderByCart')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('country', country)
      .send(sentOrder);
  };

  const get_IdFromOrderID = async (orderID, accessToken) => {
    const getOrderResponse = await request(app)
      .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
      .set('Authorization', `Bearer ${accessToken}`);
    return getOrderResponse.body.data._id;
  };

  // TODO: Refactor out all provinces from province test and import from there
  const province = {
    location: 'province',
    branch: 'Giza',
    shippingRevenue: 25,
    shippingCost: 40,
    minETA: 2,
    maxETA: 3,
    isActive: true,
    country: 'ARE',
    greenZones: [],
    redZones: [],
  };

  const defaultCountry = 'EGY';
  const product_01 = new ProductBuilder().setCountry(defaultCountry).build();
  const product_02 = new ProductBuilder().setCountry(defaultCountry).build();
  const orderTemplate = {
    receiverName: 'receiver',
    province: 'province',
    streetName: 'street',
    buildingNumber: 'buildingNumber',
    apartmentNumber: 'apartmentNumber',
    phoneNumber: '01000000000',
    phoneNumber2: '01000000000',
    notes: 'notes',
    orderReceivedBy: 'someone',
    products: [String(product_01._id), String(product_02._id)],
    productQuantities: [1, 2],
    productIds: [product_01.prodID, product_02.prodID],
    productPrices: [200, 500],
  };

  beforeAll(async () => {
    const container = await MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(MONGO_PORT)}/testDB`,
    );
    app = setupServer();
    const user01 = await registerAndLogin(app);
    accessToken_user01 = user01.data;
    user_id_user01 = user01.user._id;

    // TODO: Use an API Call
    await ProvinceModel.insertMany([province]);
    await Product.insertMany([product_01, product_02]);
    await createCountries();
  });

  describe('POST /addOrderRefund', () => {
    test('Add order refund, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrder(orderTemplate, accessToken_user01, defaultCountry);

      // find UserWallet and update with eligibleProfit
      const options = {
        userID: user_id_user01,
        currency: 'EGP',
      };
      const UserWallet = await findUserWallet(options);
      await findUserWalletByIdAndUpdate({
        id: UserWallet[0]._id,
        update: { $set: { eligibleProfit: 500 } },
        options: { new: false },
      });

      const orderIssue = {
        issueType: 1,
        // really confusing field names esp orderId and orderID
        order: { OrderId: makeOrderResponse.body.order.orderID },
        product: product_01,
        phoneNum: '',
        issueReason: 1,
        notes: '',
        issueImage: ' ',
        issueVideo: ' ',
      };

      // Act
      const addOrderRefundResponse = await request(app)
        .post('/api/orderIssues/addOrderRefund')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderIssue)
        .expect(CREATED);

      // Assert
      expect(addOrderRefundResponse.body.msg).toEqual('OrderIssue added!');
      // TODO: Assert whether the orderIssue has been updated or not from api/db
    });

    // TODO: Add test for schema validation

    // TODO: Add test for when order is not found

    // TODO: Add test on userWallet not found

    // TODO: Add test when productProfit is more than eligibleProfit

    // TODO: Add test when issue in addOrderIssue function, if possible
  });

  describe('POST /addOrderReplacement', () => {
    test('Add order replacement, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrder(orderTemplate, accessToken_user01, defaultCountry);

      const orderIssue = {
        issueType: 1,
        order: { OrderId: makeOrderResponse.body.order.orderID },
        product: product_01,
        sameProductReplacement: true,
        issueReason: 1,
        notes: ' ',
        issueImage: ' ',
        issueVideo: ' ',
      };

      // Act
      const addOrderReplacementResponse = await request(app)
        .post('/api/orderIssues/addOrderReplacement')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderIssue)
        .expect(CREATED);

      // Assert
      expect(addOrderReplacementResponse.body.msg).toEqual('OrderIssue added!');
      // TODO: Assert whether the orderIssue has been updated or not from api/db
    });

    // TODO: Add test for schema validation

    // TODO: Add test for when order is not found

    // TODO: Add test when issue in addOrderIssue function, if possible
  });

  describe('POST /addOrderCompletion', () => {
    test('Add order completion, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrder(orderTemplate, accessToken_user01, defaultCountry);

      const orderIssue = {
        issueType: 1,
        order: { OrderId: makeOrderResponse.body.order.orderID },
        product: product_01,
        notes: ' ',
      };

      // Act
      const addOrderCompletionResponse = await request(app)
        .post('/api/orderIssues/addOrderCompletion')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderIssue)
        .expect(CREATED);

      // Assert
      expect(addOrderCompletionResponse.body.msg).toEqual('OrderIssue added!');
      // TODO: Assert whether the orderIssue has been updated or not from api/db
    });

    // TODO: Add test for schema validation

    // TODO: Add test for when order is not found

    // TODO: Add test when issue in addOrderIssue function, if possible
  });

  describe('POST /getOrderIssue', () => {
    test('Get order issue, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrder(orderTemplate, accessToken_user01, defaultCountry);

      const orderId = makeOrderResponse.body.order.orderID;
      const orderObjectId = await get_IdFromOrderID(makeOrderResponse.body.order.orderID, accessToken_user01);

      const orderIssue = {
        issueType: 1,
        order: { orderObjectId: orderObjectId, OrderId: orderId },
        product: product_01,
        sameProductReplacement: true,
        issueReason: 1,
        notes: ' ',
        issueImage: ' ',
        issueVideo: ' ',
      };

      await request(app)
        .post('/api/orderIssues/addOrderReplacement')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderIssue);

      const orderOptions = { orderId: orderObjectId };

      // Act
      const getOrderIssueResponse = await request(app)
        .post('/api/orderIssues/getOrderIssue')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderOptions)
        .expect(OK);

      // Assert
      expect(getOrderIssueResponse.body.msg).toEqual('Issue found!');
      // TODO: Assert whether the orderIssue has been updated or not from api/db
    });
  });

  describe('PATCH /cancel', () => {
    test('Cancel, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrder(orderTemplate, accessToken_user01, defaultCountry);

      const orderId = makeOrderResponse.body.order.orderID;
      const orderObjectId = await get_IdFromOrderID(makeOrderResponse.body.order.orderID, accessToken_user01);

      const orderIssue = {
        issueType: 1,
        order: { orderObjectId: orderObjectId, OrderId: orderId },
        product: product_01,
        sameProductReplacement: true,
        issueReason: 1,
        notes: ' ',
        issueImage: ' ',
        issueVideo: ' ',
      };

      await request(app)
        .post('/api/orderIssues/addOrderReplacement')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderIssue);

      const orderOptions = { orderId: orderObjectId };
      const getOrderIssueResponse = await request(app)
        .post('/api/orderIssues/getOrderIssue')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderOptions);

      const cancelOrderOptions = {
        status: 'abc',
        objectId: getOrderIssueResponse.body.data[0]._id,
        orderObjectId: orderObjectId,
        orderId: orderId,
        issueType: 1,
      };

      // Act
      const cancelOrderIssueResponse = await request(app)
        .patch('/api/orderIssues/cancel')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(cancelOrderOptions)
        .expect(OK);

      // Assert
      expect(cancelOrderIssueResponse.body.msg).toEqual('Issue Cancelled');
      // TODO: Assert whether the orderIssues has been updated or not from api/db
    });

    // TODO: Add test for schema validation

    // TODO: Test a negative case, if possible
  });

  describe('POST /addIssueAttachment', () => {
    test('Add Issue Attachment, should succeed', async () => {
      // Arrange
      const issueAttachments = {};
      const mockReturnValue = { findings: [] };

      const mockAxios = new MockAdapter(axios);
      mockAxios.onPost('https://api.scanii.com/v2.1/files').replyOnce(OK, mockReturnValue);

      // Act
      const issueAttachmentResponse = await request(app)
        .post('/api/orderIssues/addIssueAttachment')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(issueAttachments)
        .expect(OK);
      // Assert
      expect(issueAttachmentResponse.body.msg).toEqual('DummyFileLocation');
    });

    // TODO: Add test for an axios failure (site not able to connect / returning bad data)

    // TODO: Add test for upload failure (or any S3 failure or multer error)
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


