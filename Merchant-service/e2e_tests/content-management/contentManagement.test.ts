process.env.SECRET = 'yallahabibi';
import request from 'supertest';
import * as dockerMongo from '../mongo/docker.mongo';
import * as expressServer from '../expressServer/expressServer';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import AnnouncementModel from '../../src/content-management/common/infrastructure/db/schemas/AnnouncementSchema';
import { countryFixture } from '../fixtures/countryFixture';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';

describe('/api/announcement', () => {
  let app: any = null;
  let accessToken: string;
  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };
  const createAnnouncements = async () => {
    await AnnouncementModel.insertMany([
      {
        img: 'testImage1',
        isMobile: false,
        link: 'testLink1',
        country: 'EGY',
      },
      {
        img: 'testImage2',
        isMobile: false,
        link: 'testLink2',
        country: 'EGY',
      },
      {
        img: 'testImage3',
        isMobile: true,
        link: 'testLink3',
        country: 'SAU',
      },
      {
        img: 'testImage4',
        isMobile: false,
        link: 'testLink4',
        country: 'ARE',
      },
    ]);
  };

  const generateAccessToken = async (): Promise<string> => {
    await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'testUser',
        password: '123456789',
        phoneNum: '01234567891',
        email: 'test@gmail.com',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: '01234567891',
        password: '123456789',
      });

    return response.body.data;
  };

  beforeAll(async () => {
    const container = await dockerMongo.MongoDockerContainer.getContainer();
    await connectDefaultConnectionToMongoDB(
      `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`,
    );

    app = expressServer.setupServer();

    await createAnnouncements();
    await createCountries();
    accessToken = await generateAccessToken();
  });
  describe('/getAnnouncements', () => {
    test('Should get ARE announcements with country header being set to ARE', async () => {
      // Act
      const countryResponse = await request(app)
        .get('/api/announcement/getAnnouncements')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'ARE');

      //Assert
      expect(countryResponse.statusCode).toEqual(200);
      expect(countryResponse.body.data.length).toEqual(1);
      expect(countryResponse.body.data[0].img).toEqual('testImage4');
      expect(countryResponse.body.data[0].link).toEqual('testLink4');
      expect(countryResponse.body.data[0].country).toEqual('ARE');
    });
    test('Should get EGY announcements with country header not being set', async () => {
      // Act
      const countryResponse = await request(app)
        .get('/api/announcement/getAnnouncements')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(countryResponse.statusCode).toEqual(200);
      expect(countryResponse.body.data.length).toEqual(2);
      expect(countryResponse.body.data[0].country).toEqual('EGY');
      expect(countryResponse.body.data[0].link).toEqual('testLink1');
      expect(countryResponse.body.data[1].country).toEqual('EGY');
      expect(countryResponse.body.data[1].link).toEqual('testLink2');
    });
    test('Should get bad request error with country header being set improperly', async () => {
      // Act
      const countryResponse = await request(app)
        .get('/api/announcement/getAnnouncements')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('country', 'WRONG_COUNTRY');

      // Assert
      expect(countryResponse.statusCode).toEqual(400);
    });
  });
  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    app = null;
  });
});


