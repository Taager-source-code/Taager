process.env.SECRET = 'yallahabibi';
import userFeaturesModel from '../../src/merchant/common/infrastructure/db/schemas/userFeatures.model';
import request from 'supertest';
import * as dockerMongo from '../mongo/docker.mongo';
import * as expressServer from '../expressServer/expressServer';
import { UserWalletEntity } from '../../src/merchant/common/infrastructure/db/models/UserWalletEntity';
import userWalletSchema from '../../src/merchant/common/infrastructure/db/schemas/userWallet.model';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

async function findOneUserWallet(userId: string, currency: string) {
  return userWalletSchema.findOne({
    userID: userId,
    currency,
  });
}

describe('wallets', () => {
  let app: any = null;
  let accessToken: string;
  let wallet: UserWalletEntity;
  let userId: string;
  let taagerID: string;
  const createWallet = async (currency = 'EGP') => {
    wallet = {
      userID: userId,
      currency,
      eligibleProfit: 0,
      deliveredOrders: 0,
      inprogressProfit: 0,
      inprogressOrders: 0,
    };
    await userWalletSchema.updateOne({ userID: userId, currency: currency }, wallet, { upsert: true });
  };
  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`,
    );
    app = expressServer.setupServer();
    const loginResult = await expressServer.registerAndLogin(app);
    accessToken = loginResult.data;
    userId = loginResult.user._id;
    taagerID = loginResult.user.TagerID;
  });
  describe('/updateWalletByUserId', () => {
    describe('200', () => {
      test('Update wallet by user id should be working fine', async () => {
        // Arrange
        const loginResult = await expressServer.loginWithAdmin(app);
        const accessToken = loginResult.data;
        userId = loginResult.user._id;
        await createWallet();
        // Act
        const updateWalletResult = await request(app)
          .post('/api/wallet/updateWalletByUserId')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            userID: userId,
            eligibleProfit: 100,
            deliveredOrders: 10,
            inprogressProfit: 0,
            inprogressOrders: 0,
            currency: 'EGP',
          });
        // Assert
        const walletAfterUpdate = await findOneUserWallet(userId, 'EGP');
        expect(updateWalletResult.statusCode).toEqual(200);
        expect(walletAfterUpdate).toMatchObject({
          eligibleProfit: 100,
          deliveredOrders: 10,
          inprogressProfit: 0,
          inprogressOrders: 0,
          currency: 'EGP',
        });
      });
      test('Should create a wallet if the wallet with specific currency does not exist', async () => {
        // Arrange
        const loginResult = await expressServer.loginWithAdmin(app);
        const accessToken = loginResult.data;
        userId = loginResult.user._id;
        const userWallet = await findOneUserWallet(userId, 'AED');
        // Act
        const updateWalletResult = await request(app)
          .post('/api/wallet/updateWalletByUserId')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            userID: userId.toString(),
            eligibleProfit: 10,
            deliveredOrders: 1,
            inprogressProfit: 10,
            inprogressOrders: 1,
            currency: 'AED',
          });
        const walletAfterUpdate = await findOneUserWallet(userId, 'AED');
        // Assert
        expect(userWallet).toBeNull();
        expect(updateWalletResult.statusCode).toEqual(200);
        expect(walletAfterUpdate).toMatchObject({
          eligibleProfit: 10,
          deliveredOrders: 1,
          inprogressProfit: 10,
          inprogressOrders: 1,
          currency: 'AED',
        });
      });
    });
  });
  describe('List wallets', () => {
    describe('GET /wallet/', () => {
      describe(`With no multitenancy feature `, () => {
        beforeEach(() => async () => {
          await userFeaturesModel.deleteMany({});
        });
        test(`Return only egy wallet if there's no multitenancy feature at all`, async () => {
          // Act
          const wallets = await request(app)
            .get('/api/wallet/')
            .set('Authorization', `Bearer ${accessToken}`);
          // Assert
          expect(wallets.statusCode).toEqual(200);
          expect(wallets.body.data).toMatchObject([
            {
              ordersCountForExpectedAmount: 0,
              eligibleAmount: 0,
              expectedAmount: 0,
              currency: 'EGP',
            },
          ]);
        });
      });
      describe(`With multitenancy feature enabled `, () => {
        afterEach(() => async () => {
          await userFeaturesModel.deleteMany({});
        });

        test(`Return only egy wallet if multitenancy enabled`, async () => {
          // Arrange
          await userFeaturesModel.create({ tagerIds: `${taagerID}`, feature: 'multitenancy_uae' });
          await userFeaturesModel.create({ tagerIds: `${taagerID}`, feature: 'multitenancy' });

          // Act
          const wallets = await request(app)
            .get('/api/wallet/')
            .set('Authorization', `Bearer ${accessToken}`);
          // Assert
          expect(wallets.statusCode).toEqual(200);
          expect(wallets.body.data).toMatchObject([
            {
              ordersCountForExpectedAmount: 0,
              eligibleAmount: 0,
              expectedAmount: 0,
              currency: 'EGP',
            },
            {
              ordersCountForExpectedAmount: 0,
              eligibleAmount: 0,
              expectedAmount: 0,
              currency: 'SAR',
            },
            {
              ordersCountForExpectedAmount: 0,
              eligibleAmount: 0,
              expectedAmount: 0,
              currency: 'AED',
            },
          ]);
        });
      });
    });

    test(`GET /wallet/?currency=AED`, async () => {
      // Act
      const wallets = await request(app)
        .get('/api/wallet/?currency=AED')
        .set('Authorization', `Bearer ${accessToken}`);
      // Assert
      expect(wallets.statusCode).toEqual(200);
      expect(wallets.body.data).toMatchObject([
        {
          ordersCountForExpectedAmount: 0,
          eligibleAmount: 0,
          expectedAmount: 0,
          currency: 'AED',
        },
      ]);
    });
  });
  afterEach(async () => {
    await userWalletSchema.deleteMany({});
  });
  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


