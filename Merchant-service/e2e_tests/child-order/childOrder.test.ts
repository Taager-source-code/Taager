import * as dockerMongo from '../mongo/docker.mongo';
import request from 'supertest';
process.env.SECRET = 'yallahabibi';
import * as expressServer from '../expressServer/expressServer';
import MigrationExecutor from '../../src/migrations/migrationExecutor';
import OrderModel from '../../src/order-management/common/infrastructure/db/schemas/order.model';
import User from '../../src/merchant/common/infrastructure/db/schemas/user.model';
import AfterSaleOrder from '../../src/order-management/queries/infrastructure/db/schemas/child-orders/AfterSaleOrderSchema';
import {
  ADDITION_ORDER_1,
  ADDITION_ORDER_2,
  REFUND_ORDER_1,
  REPLACEMENT_ORDER_1,
} from '../fixtures/afterSalesOrdersFixtures';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture } from '../fixtures/countryFixture';
import {
  ORDER_FOR_ADDITION_1,
  ORDER_FOR_ADDITION_2,
  ORDER_FOR_REFUND_1,
  ORDER_FOR_REPLACEMENT_1,
} from '../fixtures/orderFixtures';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

describe('/api/child-order', () => {
  let app: any = null;
  let accessToken: string;

  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  async function login(app: any) {
    const returnedResponse = await expressServer.registerAndLogin(app);
    accessToken = returnedResponse.data;
  }

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    const mongoUrl = `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`;
    await connectDefaultConnectionToMongoDB(mongoUrl);

    await new MigrationExecutor().migrateAll();
    await createCountries();
    app = expressServer.setupServer();
    await login(app);
  });

  afterEach(async () => {
    await User.remove({});
    await OrderModel.remove({});
    await AfterSaleOrder.remove({});
  });

  describe('GET /, view all child Orders', () => {
    async function createChildOrdersAndOrders() {
      await AfterSaleOrder.insertMany([REPLACEMENT_ORDER_1, REFUND_ORDER_1, ADDITION_ORDER_1]);
      await OrderModel.insertMany([ORDER_FOR_REFUND_1, ORDER_FOR_REPLACEMENT_1, ORDER_FOR_ADDITION_1]);
    }

    beforeEach(async () => {
      await createChildOrdersAndOrders();
    });

    test('Viewing child orders should return all orders, no country in header, no country in query', async () => {
      // Act
      await request(app)
        .get('/api/child-order?page=1&&pageSize=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(childOrderResponse => {
          expect(childOrderResponse.body.data.length).toEqual(2);
          expect(childOrderResponse.body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ orderID: ADDITION_ORDER_1.orderID }),
              expect.objectContaining({ orderID: REPLACEMENT_ORDER_1.orderID }),
            ]),
          );
        });
    });

    test(
      'Viewing child orders should return EGY orders, EGY country in query params,' +
        ' country in header will be ignored',
      async () => {
        // Act
        await request(app)
          .get('/api/child-order?page=1&&pageSize=10&&country=EGY')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(1);
            expect(childOrderResponse.body.data).toEqual(
              expect.arrayContaining([expect.objectContaining({ orderID: ADDITION_ORDER_1.orderID })]),
            );
          });
      },
    );

    test(
      'Viewing child orders should return ARE orders, ARE country in query, ' + 'country in header will be ignored',
      async () => {
        // Act
        await request(app)
          .get('/api/child-order?page=1&&pageSize=10&&country=ARE')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(1);
            expect(childOrderResponse.body.data).toMatchObject([{ orderID: REPLACEMENT_ORDER_1.orderID }]);
          });
      },
    );

    test(
      'Viewing child orders should return all order of Taager, if taagerID sent in query' +
        ', No country in query params',
      async () => {
        // Act
        await request(app)
          .get(`/api/child-order?page=1&&pageSize=10&&taagerID=100`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(2);
            expect(childOrderResponse.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ orderID: ADDITION_ORDER_1.orderID }),
                expect.objectContaining({
                  orderID: REPLACEMENT_ORDER_1.orderID,
                }),
              ]),
            );
          });
      },
    );

    test(
      'Viewing child orders should return only EGY order of Taager, if taagerID sent in query' +
        ', EGY in query params',
      async () => {
        // Act
        await request(app)
          .get(`/api/child-order?page=1&&pageSize=10&&taagerID=100&&country=EGY`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(1);
            expect(childOrderResponse.body.data).toMatchObject([{ orderID: ADDITION_ORDER_1.orderID }]);
          });
      },
    );

    afterEach(async () => {
      await AfterSaleOrder.remove({});
      await OrderModel.remove({});
    });
  });

  describe('GET /search, view all child Orders with filter obj', () => {
    async function createChildOrdersAndOrders() {
      await AfterSaleOrder.insertMany([REPLACEMENT_ORDER_1, REFUND_ORDER_1, ADDITION_ORDER_1, ADDITION_ORDER_2]);
      await OrderModel.insertMany([
        ORDER_FOR_REFUND_1,
        ORDER_FOR_REPLACEMENT_1,
        ORDER_FOR_ADDITION_1,
        ORDER_FOR_ADDITION_2,
      ]);
    }

    beforeEach(async () => {
      await createChildOrdersAndOrders();
    });

    test(
      'Viewing child orders should return only All orders for the user, ' +
        'country will be ignored in query params or in header',
      async () => {
        // Act
        await request(app)
          .get('/api/child-order/search?page=1&&pageSize=10')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(3);
            expect(childOrderResponse.body.data).toEqual(
              expect.arrayContaining([
                expect.objectContaining({ orderID: ADDITION_ORDER_1.orderID }),
                expect.objectContaining({ orderID: ADDITION_ORDER_2.orderID }),
                expect.objectContaining({
                  orderID: REPLACEMENT_ORDER_1.orderID,
                }),
              ]),
            );
          });
      },
    );

    test('Viewing child orders should return only return order with OrderID in filter, No country required', async () => {
      // Act
      await request(app)
        .get('/api/child-order/search?page=1&&pageSize=10&&filter=S100/340')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'EGY')
        .expect(200)
        .then(childOrderResponse => {
          expect(childOrderResponse.body.data.length).toEqual(1);
          expect(childOrderResponse.body.data).toMatchObject([{ orderID: ADDITION_ORDER_2.orderID }]);
        });
    });

    test(
      'Viewing child orders should return empty list, searched with OrderID in filter, ' +
        'if orderID not present for merchant, No country required',
      async () => {
        // Act
        await request(app)
          .get('/api/child-order/search?page=1&&pageSize=10&&filter=S100/349')
          .set('Authorization', `Bearer ${accessToken}`)
          .set('country', 'EGY')
          .expect(200)
          .then(childOrderResponse => {
            expect(childOrderResponse.body.data.length).toEqual(0);
          });
      },
    );

    test('Viewing child orders should return only return order with correct receiver name in filter, No country required', async () => {
      // Act
      await request(app)
        .get('/api/child-order/search?page=1&&pageSize=10&&filter=test_receiver_A2')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'EGY')
        .expect(200)
        .then(childOrderResponse => {
          expect(childOrderResponse.body.data.length).toEqual(1);
          expect(childOrderResponse.body.data).toMatchObject([{ orderID: ADDITION_ORDER_2.orderID }]);
        });
    });

    afterEach(async () => {
      await AfterSaleOrder.remove({});
      await OrderModel.remove({});
    });
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
  });
});


