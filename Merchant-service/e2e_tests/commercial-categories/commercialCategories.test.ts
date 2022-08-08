process.env.SECRET = 'yallahabibi';
import request from 'supertest';
import * as expressServer from '../expressServer/expressServer';
import * as dockerMongo from '../mongo/docker.mongo';
import MigrationExecutor from '../../src/migrations/migrationExecutor';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture } from '../fixtures/countryFixture';
import CommercialCategorySchema from '../../src/content-management/common/infrastructure/db/schemas/CommercialCategorySchema';
import { commercialCategories, commercialCategoryHierarchy } from '../fixtures/commercialCategoryFixtures';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

describe('/api/commercial-categories', () => {
  let app: any = null;
  let accessToken: string;

  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  async function login(app: any) {
    const returnedResponse = await expressServer.registerAndLogin(app);
    accessToken = returnedResponse.data;
  }

  async function createCommercialCategories() {
    await CommercialCategorySchema.insertMany(commercialCategories);
  }

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    const mongoUrl = `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`;
    await connectDefaultConnectionToMongoDB(mongoUrl);

    await new MigrationExecutor().migrateAll();
    await createCountries();
    await createCommercialCategories();
    app = expressServer.setupServer();
    await login(app);
  });

  test('Should get commercial category hierarchy with country header being set to EGY', async () => {
    // Act
    const response = await request(app)
      .get('/api/commercial-categories/hierarchy')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('country', 'EGY');

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(commercialCategoryHierarchy);
  });

  afterAll(() => {
    disconnectDefaultFromMongoDB();
  });
});


