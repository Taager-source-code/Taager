jest.mock('../../src/authentication/commands/application/usecases/auth.service');
jest.mock('../../src/email/infrastructure/email.service');
jest.mock('../../src/authentication/commands/application/usecases/socialAuth.service');

import * as dockerMongo from '../mongo/docker.mongo';
import * as expressServer from '../expressServer/expressServer';
import User from '../../src/merchant/common/infrastructure/db/schemas/user.model';
import request from 'supertest';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

const _id = '507f191e810c19729de860ea';
const TagerID = 5;
const username = 'superCoolUser';
const userLevel = 1;
const email = 'my.email@taager.com';
const email2 = 'my.new.email@taager.com';
const unknown = 'someUnknown';

describe('/api/auth', () => {
  let app: any = null;

  const createUser = async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    await User.create({
      _id,
      TagerID,
      fullName: 'Test Person',
      firstName: 'Test',
      lastName: 'Person',
      username,
      loyaltyProgram: 'GOLD',
      userLevel,
      email: email,
      verificationToken: 'SOME_VERIFICATION_TOKEN',
      verificationTokenExpiry: date,
      resetPasswordToken: 'SOME_RESET_PASSWORD_TOKEN',
      resetPasswordTokenExpiry: date,
    });
  };

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/testDB`;
    await connectDefaultConnectionToMongoDB(mongoUri);
    app = expressServer.setupServer();

    await createUser();
  });

  describe('/verifyAccount/:verificationToken', () => {
    test('200', async () => {
      // Arrange

      // Act
      const response = await request(app).patch('/api/auth/verifyAccount/SOME_VERIFICATION_TOKEN');

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    test('404', async () => {
      // Arrange

      // Act
      const response = await request(app).patch('/api/auth/verifyAccount/');

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/forgotWalletPassword', () => {
    test('200', async () => {
      // Arrange

      // Act
      const response = await request(app)
        .patch('/api/auth/forgotWalletPassword')
        .send({ email, unknown });

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    test('422', async () => {
      // Arrange

      // Act
      const response = await request(app)
        .patch('/api/auth/forgotWalletPassword')
        .send({});

      // Assert
      expect(response.statusCode).toEqual(422);
    });
  });

  describe('/checkResetPasswordToken/:resetPasswordToken', () => {
    test('200', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/api/auth/checkResetPasswordToken/SOME_RESET_PASSWORD_TOKEN');

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    test('404', async () => {
      // Arrange

      // Act
      const response = await request(app).get('/api/auth/checkResetPasswordToken');

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/auth/forgotPassword', () => {
    test('200', async () => {
      // Arrange

      // Act
      const response = await request(app)
        .patch('/api/auth/forgotPassword')
        .send({ email });

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    test('404', async () => {
      // Arrange

      // Act
      const response = await request(app)
        .get('/api/auth/forgotPassword')
        .send({ email: 'not.found.email@taager' });

      // Assert
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('/auth/socialAuthSignIn', () => {
    test('200', async () => {
      // Arrange

      // Act
      const response = await request(app)
        .post('/api/auth/socialAuthSignIn')
        .send({
          name: 'name',
          token: 'token',
          idToken: 'idToken',
          authToken: 'authToken',
          email,
          id: 'id',
          provider: 'GOOGLE',
        });

      // Assert
      expect(response.statusCode).toEqual(200);
    });

    test('201', async () => {
      // Arrange
      await User.deleteMany();

      // Act
      const response = await request(app)
        .post('/api/auth/socialAuthSignIn')
        .send({
          name: 'name',
          token: 'token',
          idToken: 'idToken',
          authToken: 'authToken',
          email: email2,
          id: 'socialId',
          provider: 'GOOGLE',
        });

      // Assert
      expect(response.statusCode).toEqual(201);
    });
  });

  afterAll(async () => {
    User.deleteMany();
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


