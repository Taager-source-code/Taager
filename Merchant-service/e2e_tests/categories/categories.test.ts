import * as dockerMongo from '../mongo/docker.mongo';
import CategoryModel from '../../src/content-management/common/infrastructure/db/schemas/category.model';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture } from '../fixtures/countryFixture';
import { leatherEGY, mobileAccessoriesSAU, occasionsEGY, selfCareSAU, shoesARE } from '../fixtures/categoryFixture';
import request from 'supertest';

process.env.SECRET = 'yallahabibi';
import * as expressServer from '../expressServer/expressServer';
import { BAD_REQUEST, OK } from 'http-status';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

describe('GET /api/category/getCategories', () => {
  let app: any = null;

  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  const createCategories = async () => {
    await CategoryModel.insertMany([leatherEGY, occasionsEGY, mobileAccessoriesSAU, selfCareSAU, shoesARE]);
  };

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`,
    );

    app = expressServer.setupServer();

    await createCountries();
    await createCategories();

    await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'testUser',
        password: '123456789',
        phoneNum: '01234567891',
        email: 'test@gmail.com',
      });
  });

  describe('GET api/category/getCategories', () => {
    test('get Categories from one country', async () => {
      // Arrange
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: '01234567891',
          password: '123456789',
        });
      const accessToken = response.body.data;

      // Act
      const filterCountry = 'SAU';
      const categoryResponse = await request(app)
        .get('/api/category/getCategories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', filterCountry);

      // Assert
      expect(categoryResponse.statusCode).toEqual(OK);
      expect(categoryResponse.body.msg).toEqual('Categories list found!');
      expect(categoryResponse.body.data).toMatchObject([mobileAccessoriesSAU, selfCareSAU]);
    });

    test('get Categories from non existent country', async () => {
      // Arrange
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: '01234567891',
          password: '123456789',
        });
      const accessToken = response.body.data;

      // Act
      const filterCountry = 'ABC';
      const categoryResponse = await request(app)
        .get('/api/category/getCategories')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', filterCountry);

      // Assert
      expect(categoryResponse.statusCode).toEqual(BAD_REQUEST);
      expect(categoryResponse.body.msg).toEqual(`Invalid country header: ${filterCountry}`);
    });
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


