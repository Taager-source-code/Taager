process.env.SECRET = 'yallahabibi';
process.env.FREE_SHIPPING_THRESHOLD = '400';
process.env.ORDER_PRICE_LIMIT = '50000';
import { setupServer } from '../expressServer/expressServer';

import request from 'supertest';
import { CONFLICT, CREATED, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from 'http-status';
import { MONGO_PORT, MongoDockerContainer } from '../mongo/docker.mongo';
import { when } from 'jest-when';
import mongoose from 'mongoose';

import { ProductBuilder } from '../fixtures/product.fixture';
import Product from '../../src/content-management/queries/infrastructure/db/schemas/ProductModel';
import ProvinceModel from '../../src/order-management/common/infrastructure/db/schemas/ProvinceSchema';
import { isShippingDiscountEnabled } from '../../src/shared-kernel/infrastructure/toggles/activeFeatureToggles';
import OrderConversationModel from '../../src/order-management/common/infrastructure/db/schemas/orderConversation.model';
import OrderModel from '../../src/order-management/common/infrastructure/db/schemas/order.model';
import { countryFixture } from '../fixtures/countryFixture';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';

jest.mock('../../src/shared-kernel/infrastructure/config/Log');
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

jest.mock('../../src/shared-kernel/infrastructure/toggles/activeFeatureToggles');
const TAAGER_ID = 100;
const setUpToggleForFreeShipping = value => {
  when(isShippingDiscountEnabled)
    .calledWith(TAAGER_ID)
    .mockReturnValue(value);
};
describe('/order API endpoints', () => {
  let app: any = null;
  let accessToken_user01: string;
  let accessToken_user02: string;

  const registerUsersAndGenerateAccessTokens = async () => {
    // TODO: Reuse user across merchant tests
    const registerUserResponse = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'testUser_01',
        password: '123456789',
        phoneNum: '01234567891',
        email: 'test_01@taager.com',
      });

    await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'testUser_02',
        password: '123456789_02',
        phoneNum: '01234567891_02',
        email: 'test_02@taager.com',
        referredBy: registerUserResponse.body.user._id,
      });

    const responseFirstUser = await request(app)
      .post('/api/auth/login')
      .send({
        username: '01234567891',
        password: '123456789',
      });
    const responseSecondUser = await request(app)
      .post('/api/auth/login')
      .send({
        username: '01234567891_02',
        password: '123456789_02',
      });

    return {
      firstAccessToken: responseFirstUser.body.data,
      secondAccessToken: responseSecondUser.body.data,
    };
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
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  const product_01 = new ProductBuilder().build();
  const product_02 = new ProductBuilder().build();
  const product_03_SAU = new ProductBuilder().setCountry('SAU').build();
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
  const orderTemplateInSAU = {
    receiverName: 'receiver',
    province: 'province',
    streetName: 'street',
    buildingNumber: 'buildingNumber',
    apartmentNumber: 'apartmentNumber',
    phoneNumber: '01000000000',
    phoneNumber2: '01000000000',
    notes: 'notes',
    orderReceivedBy: 'someone',
    products: [String(product_03_SAU._id)],
    productQuantities: [1, 2],
    productIds: [product_03_SAU.prodID],
    productPrices: [200, 500],
  };
  const makeOrder = (sentOrder, accessToken, country) => {
    return request(app)
      .post('/api/order/makeOrderByCart')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('country', country)
      .send(sentOrder);
  };
  const makeOrderByUser01 = (sentOrder, country = 'EGY') => {
    return makeOrder(sentOrder, accessToken_user01, country);
  };
  const makeOrderByUser02 = (sentOrder, country = 'EGY') => {
    return makeOrder(sentOrder, accessToken_user02, country);
  };
  const get_IdFromOrderID = async orderID => {
    const getOrderResponse = await request(app)
      .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
      .set('Authorization', `Bearer ${accessToken_user01}`);
    return getOrderResponse.body.data._id;
  };

  function viewMyOrder(accessToken: string, orderFilter) {
    return request(app)
      .post('/api/order/viewMyOrders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(orderFilter);
  }

  beforeAll(async () => {
    const container = await MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(MONGO_PORT)}/testDB`,
    );

    app = setupServer();

    const accessTokens = await registerUsersAndGenerateAccessTokens();
    accessToken_user01 = accessTokens.firstAccessToken;
    accessToken_user02 = accessTokens.secondAccessToken;

    // TODO: Use an API Call
    await ProvinceModel.insertMany([province]);
    await Product.insertMany([product_01, product_02, product_03_SAU]);
    await createCountries();
  });

  describe('GET /summary', () => {
    // TODO: Add more tests later on
    test('Getting user orders summary should succeed', async () => {
      // Act
      const orderSummaryResponse = await request(app)
        .get(`/api/order/summary`)
        .set('Authorization', `Bearer ${accessToken_user01}`);
      // Assert
      // TODO: Assert better. ported as legacy
      expect(orderSummaryResponse.statusCode).toEqual(OK);
    });
  });

  // TODO: Add tests later on
  describe('GET /operations-rates', () => {
    // TODO: Implement test
    test('Operation rate test', async () => {
      // Arrange
      // Act
      // Assert
    });
  });

  describe('POST /makeOrderByCart', () => {
    test('Create Order with missing parameters, should fail', async () => {
      // Arrange
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { province, ...sentOrder } = orderTemplate;

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder);

      // Assert
      expect(createOrderResponse.statusCode).toEqual(UNPROCESSABLE_ENTITY);
      expect(createOrderResponse.body.msg).toEqual('"province" is required');
    });

    // TODO: Implement test
    test('Try to process duplicate orders, should process only one', async () => {
      // Arrange
      // Act
      // Assert
    });

    // TODO: Implement test
    test('Create Order from cart, cart should be empty after order is created', async () => {
      // Arrange
      // Act
      // Assert
    });

    test('Create Order by Cart with free shipping', async () => {
      // Arrange
      setUpToggleForFreeShipping(true);
      const sentOrder = { ...orderTemplate };

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder).expect(CREATED);

      const orderID = createOrderResponse.body.order.orderID;
      const getOrderResponse = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user01}`);
      expect(getOrderResponse.statusCode).toEqual(OK);

      const expectedOrder: any = { ...sentOrder };
      // THIS WILL CHANGE DEPENDING ON ENVIRONMENT
      expectedOrder.cashOnDelivery = 725;
      expectedOrder.orderProfit = 1300;
      expect(getOrderResponse.body.data).toMatchObject(expectedOrder);
      expect(getOrderResponse.body.data.orderLines).toMatchObject([
        {
          orderLineId: 1,
          productId: expectedOrder.productIds[0],
          quantity: expectedOrder.productQuantities[0],
          totalPrice: expectedOrder.productPrices[0],
          totalMerchantProfit: 400,
          direction: 'forward',
          type: 'initial',
          status: 'created',
          events: [
            {
              eventType: 'created',
              orderLineId: 1,
              productId: expectedOrder.productIds[0],
              quantity: expectedOrder.productQuantities[0],
              totalPrice: expectedOrder.productPrices[0],
              totalMerchantProfit: 400,
              direction: 'forward',
              type: 'initial',
            },
          ],
        },
        {
          orderLineId: 2,
          productId: expectedOrder.productIds[1],
          quantity: expectedOrder.productQuantities[1],
          totalPrice: expectedOrder.productPrices[1],
          totalMerchantProfit: 900,
          direction: 'forward',
          type: 'initial',
          status: 'created',
          events: [
            {
              eventType: 'created',
              orderLineId: 2,
              productId: expectedOrder.productIds[1],
              quantity: expectedOrder.productQuantities[1],
              totalPrice: expectedOrder.productPrices[1],
              totalMerchantProfit: 900,
              direction: 'forward',
              type: 'initial',
            },
          ],
        },
      ]);
    });

    test('Create Order by Cart with shipping fee', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };
      sentOrder['products'] = [String(product_01._id)];
      sentOrder['productQuantities'] = [1];
      sentOrder['productPrices'] = [200];

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder);

      // Assert
      expect(createOrderResponse.statusCode).toEqual(CREATED);

      const orderID = createOrderResponse.body.order.orderID;
      const getOrderResponse = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user01}`);
      expect(getOrderResponse.statusCode).toEqual(OK);

      const expectedOrder = { ...sentOrder };
      expectedOrder['orderProfit'] = 400;
      expectedOrder['cashOnDelivery'] = 225;
      expect(getOrderResponse.body.data).toMatchObject(expectedOrder);
    });

    test('Create Order from cart where product price is below base price, should fail', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };
      // Reducing order price on the second order
      sentOrder['productPrices'] = [200, 100];

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder);

      // Assert
      expect(createOrderResponse.statusCode).toEqual(CONFLICT);
      expect(createOrderResponse.body.msg).toEqual('Product sold below base price');
      expect(createOrderResponse.body.products.map(p => p.prodID)).toEqual([product_02.prodID]);
    });

    test('Create Order with invalid province, should fail', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };
      sentOrder['province'] = 'non-existent province';

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder);

      // Assert
      expect(createOrderResponse.statusCode).toEqual(CONFLICT);
      expect(createOrderResponse.body.msg).toEqual('Province does not exist in database');
    });

    test('Create Order with missing product, should fail', async () => {
      // Arrange
      const product_03 = new ProductBuilder().build();
      const sentOrder = { ...orderTemplate };
      sentOrder['products'] = [String(product_03._id)];
      sentOrder['productQuantities'] = [1];
      sentOrder['productIds'] = [product_03.prodID];
      sentOrder['productPrices'] = [100];

      // Act
      // const createOrderResponse = await makeOrderByUser01(sentOrder);
      await makeOrderByUser01(sentOrder);

      // Assert
      // TODO: Fix visibleToSellers not being a member and then re-add asserts
    });

    test('Create Order from SAU with EGY product, should fail with CONFLICT status', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };

      // Act
      const result = await makeOrderByUser01(sentOrder, 'SAU');

      // Assert
      expect(result.statusCode).toEqual(CONFLICT);
    });

    test('Create Order from cart where total price exceed limit, should fail', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };
      // Reducing order price on the second order
      sentOrder['productPrices'] = [40000, 30000];

      // Act
      const createOrderResponse = await makeOrderByUser01(sentOrder);

      // Assert
      expect(createOrderResponse.statusCode).toEqual(CONFLICT);
      expect(createOrderResponse.body.msg).toMatch('Order Price exceeds the allowed limit');
    });
  });

  describe('POST /viewAllOrdersWithMessagesUser', () => {
    test('View messages of orders created', async () => {
      // Arrange
      const orderConversation = { _id: new mongoose.Types.ObjectId() };
      // TODO: Use an API Call
      const insertedOrderConversations = await OrderConversationModel.insertMany([orderConversation]);
      const order = await makeOrderByUser01(orderTemplate);

      await OrderModel.findOneAndUpdate(
        { orderID: order.body.order.orderID },
        { ConversationId: insertedOrderConversations[0]._id },
      );

      // Act
      const getOrderWithConversation = await request(app)
        .post('/api/order/viewAllOrdersWithMessagesUser')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getOrderWithConversation.statusCode).toEqual(OK);
      expect(getOrderWithConversation.body.data[0].message).toEqual('Order Not Rejected');
    });

    test('Retrieve orders without messages, should return empty', async () => {
      // Act
      const getOrderWithConversation = await request(app)
        .post('/api/order/viewAllOrdersWithMessagesUser')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      // TODO: Check if this behaviour is OK?
      expect(getOrderWithConversation.statusCode).toEqual(OK);
      expect(getOrderWithConversation.body.data).toEqual([]);
    });

    afterEach(async () => {
      // TODO: Use an API call
      await OrderModel.deleteMany({});
    });
  });

  describe('POST /viewOrdersWithUnreadMessages', () => {
    test('View messages of orders created', async () => {
      // Arrange
      const orderConversation = { _id: new mongoose.Types.ObjectId() };
      // TODO: Use an API Call
      const insertedOrderConversations = await OrderConversationModel.insertMany([orderConversation]);
      const order = await makeOrderByUser01(orderTemplate);

      await OrderModel.findOneAndUpdate(
        { orderID: order.body.order.orderID },
        { ConversationId: insertedOrderConversations[0]._id },
      );

      // Act
      const getOrderWithUnreadMessages = await request(app)
        .post('/api/order/viewOrdersWithUnreadMessages')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getOrderWithUnreadMessages.statusCode).toEqual(OK);
      expect(getOrderWithUnreadMessages.body.msg).toEqual('Orders message list found!');
    });

    test('Retrieve orders with read messages, should return empty', async () => {
      // Arrange
      const orderConversation = { _id: new mongoose.Types.ObjectId() };
      // TODO: Use an API Call
      const insertedOrderConversations = await OrderConversationModel.insertMany([orderConversation]);
      const order = await makeOrderByUser01(orderTemplate);

      await OrderModel.findOneAndUpdate(
        { orderID: order.body.order.orderID },
        { ConversationId: insertedOrderConversations[0]._id, isUserRead: true },
      );

      // Act
      const getOrderWithUnreadMessages = await request(app)
        .post('/api/order/viewOrdersWithUnreadMessages')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getOrderWithUnreadMessages.statusCode).toEqual(OK);
      expect(getOrderWithUnreadMessages.body.data).toEqual([]);
    });

    afterEach(async () => {
      // TODO: Use an API call
      await OrderModel.deleteMany({});
    });
  });

  describe('POST /viewMyOrders', () => {
    test('view my orders with default options, should succeed', async () => {
      // Arrange
      await makeOrderByUser01(orderTemplate);

      const orderFilter = {
        filterObj: {},
      };

      // Act
      const viewMyOrderResponse = await viewMyOrder(accessToken_user01, orderFilter).expect(OK);

      // Assert
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(orderTemplate);
    });
    test('view my SAU orders with default options, should succeed', async () => {
      // Arrange
      const sentOrder = { ...orderTemplateInSAU };
      await makeOrderByUser01(sentOrder, 'SAU').expect(201);

      const orderFilter = {
        filterObj: { country: 'SAU' },
      };

      // Act
      const viewMyOrderResponse = await viewMyOrder(accessToken_user01, orderFilter).expect(OK);

      // Assert
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(sentOrder);
    });

    test('view orders with wrong user, should return empty array', async () => {
      // Arrange
      const sentOrder = { ...orderTemplate };
      await makeOrderByUser01(sentOrder);

      const orderFilter = {
        filterObj: {},
      };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrders')
        .set('Authorization', `Bearer ${accessToken_user02}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data).toEqual([]);
    });

    test('view orders with a specific status, should succeed', async () => {
      // Arrange
      await makeOrderByUser01(orderTemplate);
      const order = await makeOrderByUser01(orderTemplate);
      await OrderModel.findOneAndUpdate({ orderID: order.body.order.orderID }, { status: 'delivered' });

      const orderFilter = {
        filterObj: { status: 'delivered', showAllOrders: true },
      };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data.length).toEqual(1);
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(orderTemplate);
    });

    test('view orders By order ID, should succeed', async () => {
      // Arrange
      const sentOrder_01 = { ...orderTemplate };
      const sentOrder_02 = { ...orderTemplate };

      await makeOrderByUser01(sentOrder_01);
      const secondOrder = await makeOrderByUser01(sentOrder_02);

      const orderFilter = {
        filterObj: {
          orderId: secondOrder.body.order.orderID,
          showAllOrders: true,
        },
      };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data.length).toEqual(1);
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(sentOrder_02);
    });

    // TODO: Add test for getting orders between date ranges

    // TODO: Add test for getting orders with hasIssues filter

    // TODO: Add test for validating isOrderVerified conditions

    afterAll(async () => {
      // TODO: Use an API call
      await OrderModel.deleteMany({});
    });
  });

  describe('POST /viewMyOrdersExtract', () => {
    beforeAll(async () => {
      await makeOrderByUser01(orderTemplate);
    });

    test('Get all orders, should succeed', async () => {
      // Arrange
      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        products,
        apartmentNumber,
        buildingNumber,
        orderReceivedBy,
        phoneNumber2,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...expectedReturnedOrder
      } = orderTemplate;

      const orderFilter = { filterObj: { showAllOrders: true } };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrdersExtract')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(expectedReturnedOrder);
    });

    test('Get orders of wrong user ,should return empty array ', async () => {
      // Arrange
      const orderFilter = { filterObj: { showAllOrders: true } };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrdersExtract')
        .set('Authorization', `Bearer ${accessToken_user02}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data).toEqual([]);
    });

    test('Get orders by status, should return orders with correct status', async () => {
      // Arrange
      const order = await makeOrderByUser01(orderTemplate);

      await OrderModel.findOneAndUpdate({ orderID: order.body.order.orderID }, { status: 'delivered' });

      const {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        products,
        apartmentNumber,
        buildingNumber,
        orderReceivedBy,
        phoneNumber2,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...expectedReturnedOrder
      } = { ...orderTemplate };

      const orderFilter = {
        filterObj: { status: 'delivered', showAllOrders: true },
      };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/viewMyOrdersExtract')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data.length).toEqual(1);
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(expectedReturnedOrder);
    });

    // TODO: Add tests to cater for more filter conditions

    afterAll(async () => {
      // TODO: Use an API call
      await OrderModel.deleteMany({});
    });
  });

  describe('POST /searchInMyOrders', () => {
    test('Search existing using receiver name, should find an order', async () => {
      // Arrange
      await makeOrderByUser01(orderTemplate);
      const orderFilter = { filter: orderTemplate.receiverName };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/searchInMyOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(orderTemplate);
    });

    test('Search for order using orderID, should find an order', async () => {
      // Arrange
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderFilter = { filter: makeOrderResponse.body.order.orderID };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/searchInMyOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data[0]).toMatchObject(orderTemplate);
    });

    test('Search for order made by other user, should return empty array', async () => {
      // Arrange
      await makeOrderByUser01(orderTemplate);
      const orderFilter = { filter: orderTemplate.receiverName };

      // Act
      const viewMyOrderResponse = await request(app)
        .post('/api/order/searchInMyOrders')
        .set('Authorization', `Bearer ${accessToken_user02}`)
        .send(orderFilter);

      // Assert
      expect(viewMyOrderResponse.statusCode).toEqual(OK);
      expect(viewMyOrderResponse.body.msg).toEqual('Orders found!');
      expect(viewMyOrderResponse.body.data).toEqual([]);
    });

    afterAll(async () => {
      // TODO: Use an API call
      await OrderModel.deleteMany({});
    });
  });

  describe('PATCH /cancelOrder', () => {
    test('Successfully cancel order, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderID = makeOrderResponse.body.order.orderID;

      const ordersBody = {
        orders: [
          {
            _id: await get_IdFromOrderID(orderID),
            orderID: orderID,
          },
        ],
        status: 'cancel',
      };

      // Act
      const cancelOrderResponse = await request(app)
        .patch('/api/order/cancelOrder')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(ordersBody);

      // Assert
      expect(cancelOrderResponse.statusCode).toEqual(OK);
      expect(cancelOrderResponse.body.msg).toEqual('Order cancelled successfully');

      const getOrderResponseAfterCancellation = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user01}`);
      expect(getOrderResponseAfterCancellation.body.data.status).toEqual('taager_cancelled');
    });

    // TODO: test on failing to cancel order, if possible
  });

  describe('PATCH /updateOrderStatusCustom', () => {
    test('Update order status to return_in_progress, should be successful', async () => {
      // Arrange
      // TODO: User level 3 required for test to work
      // Act
      // Assert
    });
  });

  describe('PATCH /revertOrderStatus', () => {
    test('Revert order status, should be successful', async () => {
      // Arrange
      // TODO: User level 3 required for test to work
      // Act
      // Assert
    });
  });

  describe('PATCH /rateOrder', () => {
    test('Rate Order, should be rated successfully', async () => {
      // Arrange
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderID = makeOrderResponse.body.order.orderID;

      const orderRating = 5;
      const orderComplaint = 'No complaint';
      const rateOrderBody = {
        orderID: await get_IdFromOrderID(orderID),
        rating: orderRating,
        complain: orderComplaint,
      };

      // Act
      const rateOrderResponse = await request(app)
        .patch('/api/order/rateOrder')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(rateOrderBody);

      // Assert
      expect(rateOrderResponse.statusCode).toEqual(OK);
      expect(rateOrderResponse.body.msg).toEqual('Order(s) verified successfully');
      expect(rateOrderResponse.body.data).toEqual({});

      const getOrderResponseAfterRating = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user01}`);
      expect(getOrderResponseAfterRating.body.data.rating).toEqual(orderRating);
      expect(getOrderResponseAfterRating.body.data.complain).toEqual(orderComplaint);
    });

    // TODO: Test with an invalid order ID
  });

  describe('GET /getReferralsOrders', () => {
    test('Get referral orders, should succeed', async () => {
      // Arrange
      await makeOrderByUser02(orderTemplate);

      // Act
      const getReferralsOrdersResponse = await request(app)
        .get('/api/order/getReferralsOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getReferralsOrdersResponse.statusCode).toEqual(OK);
      expect(getReferralsOrdersResponse.body.msg).toEqual('Orders found!');
      expect(getReferralsOrdersResponse.body.countUsers).toEqual(1);
      expect(getReferralsOrdersResponse.body.countOrders).toEqual(1);
    });

    test('Get referral orders from user with no referrals, should return empty array', async () => {
      // Arrange
      // default user has no referrals
      await makeOrderByUser01(orderTemplate);

      // Act
      const getReferralsOrdersResponse = await request(app)
        .get('/api/order/getReferralsOrders')
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getReferralsOrdersResponse.statusCode).toEqual(OK);
      expect(getReferralsOrdersResponse.body.msg).toEqual('Orders found!');
      expect(getReferralsOrdersResponse.body.countUsers).toEqual(1);
      expect(getReferralsOrdersResponse.body.countOrders).toEqual(0);
    });

    afterEach(async () => {
      // TODO: Use an API Call
      await OrderModel.deleteMany({});
    });
  });

  describe('GET /orderId/:orderId', () => {
    test('Get order by valid order Id, should be found', async () => {
      // Arrange
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderID = makeOrderResponse.body.order.orderID;

      // Act
      const getOrderIdResponse = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user01}`);

      // Assert
      expect(getOrderIdResponse.statusCode).toEqual(OK);
      expect(getOrderIdResponse.body.data).toMatchObject(orderTemplate);
    });

    test('Get order by invalid user Id, should return error', async () => {
      // Arrange
      const orderID = '100/1';

      // Act
      const getOrderIdResponse = await request(app)
        .get(`/api/order/orderId/${encodeURIComponent(orderID)}`)
        .set('Authorization', `Bearer ${accessToken_user02}`);

      // Assert
      expect(getOrderIdResponse.statusCode).toEqual(NOT_FOUND);
      expect(getOrderIdResponse.body.msg).toEqual("Looks like this order doesn't exist!");
    });
  });

  describe('POST /getOrdersByUsers', () => {
    // TODO: Implement tests
    test('Get Order By a user, should be successful', async () => {
      // Arrange
      // TODO: User level 3 required for test to work
      // Act
      // Assert
    });
  });

  describe('GET /getLastUpdatedOrders', () => {
    // TODO: Implement tests
    test('Get lat updated order for user, should be successful', async () => {
      // Arrange
      // TODO: User level 3 required for test to work
      // Act
      // Assert
    });
  });

  describe('GET /getActiveBostaOrders', () => {
    // TODO: Implement tests
    test('Get Active Bosta orders, should be successful', async () => {
      // Arrange
      // TODO: User level 3 required for test to work
      // Act
      // Assert
    });
  });

  describe('POST /getOrderActivityWithStatus', () => {
    test('Get order activity with status, should succeed', async () => {
      // Arrange
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderID = makeOrderResponse.body.order.orderID;
      const orderFilter = {
        filterObj: { orderStatus: 'order_received' },
      };

      // Act
      const getOrderActivityResponse = await request(app)
        .post(`/api/order/getOrderActivityWithStatus`)
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(getOrderActivityResponse.statusCode).toEqual(OK);
      expect(getOrderActivityResponse.body.msg).toEqual('Orders found!');
      expect(getOrderActivityResponse.body.data[0].doc.orderID).toEqual(orderID);
    });

    test('Get order activity with status, should return only current users orders', async () => {
      // Arrange
      await makeOrderByUser02(orderTemplate);
      const makeOrderResponse = await makeOrderByUser01(orderTemplate);
      const orderID = makeOrderResponse.body.order.orderID;
      const orderFilter = {
        filterObj: { orderStatus: 'order_received' },
      };

      // Act
      const getOrderActivityResponse = await request(app)
        .post(`/api/order/getOrderActivityWithStatus`)
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send(orderFilter);

      // Assert
      expect(getOrderActivityResponse.statusCode).toEqual(OK);
      expect(getOrderActivityResponse.body.msg).toEqual('Orders found!');
      expect(getOrderActivityResponse.body.data.length).toEqual(1);
      expect(getOrderActivityResponse.body.data[0].doc.orderID).toEqual(orderID);
    });
  });

  describe('POST /calculate-cost', () => {
    test('Retrieve order financials breakdown (shipping cost no free delivery)', async () => {
      const createResponse = await request(app)
        .post('/api/order/calculate-cost')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send({
          province: 'province',
          products: [product_01._id],
          productQuantities: [1],
          productIds: [product_01.prodID],
          productPrices: [200],
        });

      expect(createResponse.statusCode).toEqual(OK);
      expect(createResponse.body.data.shipping.discountedRate).toEqual(25);
      expect(createResponse.body.data.shipping.regularRate).toEqual(25);
    });

    test('Retrieve order financials breakdown (shipping cost with free delivery)', async () => {
      setUpToggleForFreeShipping(true);
      const createResponse = await request(app)
        .post('/api/order/calculate-cost')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .send({
          province: 'province',
          products: [product_01._id, product_02._id],
          productQuantities: [2, 3],
          productIds: [product_01.prodID, product_02.prodID],
          productPrices: [200, 500],
        });

      expect(createResponse.statusCode).toEqual(OK);
      expect(createResponse.body.data.shipping.discountedRate).toEqual(0);
      expect(createResponse.body.data.shipping.regularRate).toEqual(25);
    });

    test('Retrieve order financials breakdown for Egyptian products while header is SAU should fail', async () => {
      //Act
      const createResponse = await request(app)
        .post('/api/order/calculate-cost')
        .set('Authorization', `Bearer ${accessToken_user01}`)
        .set('country', `SAU`)
        .send({
          province: 'province',
          products: [product_01._id],
          productQuantities: [1],
          productIds: [product_01.prodID],
          productPrices: [200],
        });
      // Assert
      expect(createResponse.statusCode).toEqual(CONFLICT);
    });
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


