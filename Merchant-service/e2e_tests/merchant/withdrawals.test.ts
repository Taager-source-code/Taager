import { when } from 'jest-when';
import {
  isWithdrawalRequestBlockDatesActivated,
  isRamadanBlockEnabled,
} from '../../src/shared-kernel/infrastructure/toggles/activeFeatureToggles';

process.env.SECRET = 'yallahabibi';
import request from 'supertest';
import * as dockerMongo from '../mongo/docker.mongo';
import * as expressServer from '../expressServer/expressServer';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import UserWallets from './../../src/merchant/common/infrastructure/db/schemas/userWallet.model';
import PaymentRequest from './../../src/merchant/common/infrastructure/db/schemas/paymentRequest.model';
import { countryFixture } from '../fixtures/countryFixture';

jest.mock('../../src/shared-kernel/infrastructure/config/Log');
import { UserWalletEntity } from '../../src/merchant/common/infrastructure/db/models/UserWalletEntity';
import { UserFixture } from '../fixtures/UserFixture';
import { withdrawal } from '../fixtures/WithdrawalFixture';
import { TransactionManager } from '../../src/shared-kernel/infrastructure/transactions/TransactionManager';
import { Container } from 'typedi';
import { MockedTransactionManager } from '../mocks/MockedTransactionManager';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

jest.mock('../../src/shared-kernel/infrastructure/transactions/TransactionManager');
jest.mock('../../src/shared-kernel/infrastructure/toggles/activeFeatureToggles');
describe('payment requests And withdrawals', () => {
  let app: any = null;
  let accessToken: string;
  let wallet: UserWalletEntity;
  let userId: string;
  const createOrUpdateWallet = async (eligibleProfit = 0, currency = 'EGP') => {
    wallet = {
      userID: userId,
      currency: currency,
      totalProfit: 0,
      countOrders: 0,
      eligibleProfit: eligibleProfit,
      deliveredOrders: 0,
      inprogressProfit: 0,
      inprogressOrders: 0,
      incomingProfit: 0,
      receivedOrders: 0,
    };
    await UserWallets.updateOne({ userID: userId, currency: currency }, wallet, { upsert: true });
  };
  const isWithdrawalRequestFeatureBlockEnabled = result => {
    when(isRamadanBlockEnabled)
      .calledWith(expect.anything())
      .mockReturnValue(result);
  };
  const isWithdrawalReqBlockDatesActivated = result => {
    when(isWithdrawalRequestBlockDatesActivated)
      .calledWith()
      .mockReturnValue(result);
  };
  async function updateWithdrawal(app: any, withdrawalId, status: string) {
    await PaymentRequest.updateOne({ withdrawalId: withdrawalId }, { $set: { status: status } });
  }
  async function assertWalletDebited(currency: string, expectedEligibleProfit: number) {
    const userWallet = await UserWallets.findOne({
      userID: userId,
      currency: currency,
    });
    expect(userWallet).toMatchObject({
      eligibleProfit: expectedEligibleProfit,
      currency: currency,
    });
  }
  function requestWithdrawal(app: any, currency: string) {
    return request(app)
      .post('/api/withdrawals/request')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 100,
        currency: currency,
        paymentMethod: 'vodafone_cash',
        phoneNum: UserFixture.phoneNum,
      });
  }
  function listPayments(currency: string | null, status: string[]) {
    const query: any = {
      page: 1,
      pageSize: 10,
      status: status,
    };
    if (currency) query.currency = currency;
    return request(app)
      .post('/api/withdrawals/list')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(query);
  }

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`,
    );
    app = expressServer.setupServer();
    await CountryModel.insertMany(countryFixture);
    const loginResult = await expressServer.registerAndLogin(app);
    accessToken = loginResult.data;
    userId = loginResult.user._id;
    Container.set(TransactionManager, new MockedTransactionManager());
  });
  describe('test old apis for compatability', () => {
    test('create, list and update payment request successfully', async () => {
      // Act
      await createOrUpdateWallet(500);
      const countryResponse = await request(app)
        .post('/api/payment/createPaymentRequest')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          amount: 100,
          paymentWay: 'vodafone_cash',
          phoneNum: UserFixture.phoneNum,
          userId: userId,
          status: 'received',
        });
      expect(countryResponse.body).toMatchObject({
        msg: 'Payment Request added!',
      });
      expect(countryResponse.statusCode).toEqual(201);
      const userWallet = await UserWallets.findOne({
        userID: userId,
        currency: 'EGP',
      });
      expect(userWallet).toMatchObject({ eligibleProfit: 400 });
      const requestsResults = await request(app)
        .get(`/api/payment/getMyPaymentRequests?page=1&pageSize=10`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(requestsResults.statusCode).toEqual(200);
      expect(requestsResults.body).toMatchObject({
        msg: 'Requests list found!',
        data: [
          {
            amount: 100,
            currency: 'EGP',
            paymentWay: 'vodafone_cash',
            phoneNum: UserFixture.phoneNum,
            userId: { _id: userId.toString() },
            status: 'received',
          },
        ],
        count: 1,
      });
    });
  });
  describe('test withdrawals apis', () => {
    test('request, list and update withdrawals successfully', async () => {
      // Act
      await createOrUpdateWallet(500, 'SAR');
      await createOrUpdateWallet(500, 'EGP');
      await createOrUpdateWallet(500, 'AED');

      isWithdrawalRequestFeatureBlockEnabled(false);
      // Act request SAR withdrawal
      await requestWithdrawal(app, 'SAR').expect(201);
      await requestWithdrawal(app, 'EGP').expect(201);
      // Assert EGP and SAR wallets debited
      await assertWalletDebited('SAR', 400);
      await assertWalletDebited('EGP', 400);

      //Act: list pending withdrawals with empty status filter
      const requestsResults = await listPayments(null, [])
        .expect(200)
        .expect(result =>
          expect(result.body).toMatchObject({
            data: {
              count: 2,
              withdrawals: [withdrawal('EGP', 'pending'), withdrawal('SAR', 'pending')],
            },
          }),
        );

      // Act: start update the withdrawal
      const withdrawalId = requestsResults.body.data.withdrawals[0].id;
      const currency = requestsResults.body.data.withdrawals[0].currency;
      // Act: in progress the withdrawal
      await updateWithdrawal(app, withdrawalId, 'inprogress');

      //Act: list in-progress withdrawals
      await listPayments(currency, ['pending'])
        .expect(200)
        .expect(result =>
          expect(result.body).toMatchObject({
            data: {
              count: 1,
              withdrawals: [withdrawal(currency, 'pending')],
            },
          }),
        );

      // Act: accepts the withdrawal
      await updateWithdrawal(app, withdrawalId, 'successful');
      //Assert: list accepted withdrawals
      await listPayments(currency, ['accepted'])
        .expect(200)
        .expect(result =>
          expect(result.body).toMatchObject({
            data: {
              count: 1,
              withdrawals: [withdrawal(currency, 'accepted')],
            },
          }),
        );
      // Act: rejects the withdrawal
      await updateWithdrawal(app, withdrawalId, 'rejected');
      //Assert: list rejected withdrawals
      await listPayments(currency, ['rejected'])
        .expect(200)
        .expect(result =>
          expect(result.body).toMatchObject({
            data: {
              count: 1,
              withdrawals: [withdrawal(currency, 'rejected')],
            },
          }),
        );
    });
    test('request, Withdrawal Request should be rejected if the feature is blocked within date duration ', async () => {
      // Act
      await createOrUpdateWallet(500, 'EGP');

      isWithdrawalRequestFeatureBlockEnabled(true);
      isWithdrawalReqBlockDatesActivated(true);

      // Act and Assert
      await requestWithdrawal(app, 'EGP')
        .expect(503)
        .expect(result => expect(result.body).toHaveProperty('errorCode', 'withdrawals-0004'));

      // Assert EGP
      await assertWalletDebited('EGP', 500);
    });
  });
  afterEach(async () => {
    await PaymentRequest.deleteMany({});
    await UserWallets.deleteMany({});
  });
  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


