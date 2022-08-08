
Skip to main content
Continuous Code Quality

    Projects
    Issues
    Rules
    Quality Profiles
    Quality Gates

    BM

merchant-service
master
August 2, 2022 at 11:33 AMVersion not provided

    Overview
    Issues
    Security Hotspots
    Measures
    Code
    Activity

    Project Information

merchant-service
e2e_tests
countries

    countries.test.ts

merchant-service
e2e_tests/countries/countries.test.ts
Unit Tests2
Bug0
Vulnerability0
Code Smell0
Security Hotspot0

import * as dockerMongo from '../mongo/docker.mongo';

import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';

import request from 'supertest';

process.env.SECRET = 'yallahabibi';

import * as expressServer from '../expressServer/expressServer';

import { countryFixture } from '../fixtures/countryFixture';

import {

  connectDefaultConnectionToMongoDB,

  disconnectDefaultFromMongoDB,

} from '../../src/shared-kernel/infrastructure/config/mongoose';

import userFeaturesModel from '../../src/merchant/common/infrastructure/db/schemas/userFeatures.model';

describe('/api/countries', () => {

  let app: any = null;

  let taagerID: string;

  let accessToken: string;

  const createCountry = async () => {

    await CountryModel.insertMany(countryFixture);

  };

  beforeAll(async () => {

    const container = await dockerMongo.MongoDockerContainer.getContainer();

    await connectDefaultConnectionToMongoDB(

      `mongodb://${container.getHost()}:${container.getMappedPort(dockerMongo.MONGO_PORT)}/testDB`,

    );

    app = expressServer.setupServer();

    await createCountry();

    const loginResult = await expressServer.registerAndLogin(app);

    accessToken = loginResult.data;

    taagerID = loginResult.user.TagerID;

  });

  describe('/countries', () => {

    describe(`With no multitenancy feature`, () => {

      beforeEach(() => async () => {

        await userFeaturesModel.deleteMany({});

      });

      test(`Return only egy country if there's no multitenancy feature at all`, async () => {

        // Act

        const countryResponse = await request(app)

          .get('/api/countries')

          .set('Authorization', `Bearer ${accessToken}`);

        // Assert

        expect(countryResponse.statusCode).toEqual(200);

        expect(countryResponse.body.data.length).toEqual(1);

        expect(countryResponse.body.msg).toEqual('success');

      });

    });

    describe(`With multitenancy feature enabled`, () => {

      afterEach(() => async () => {

        await userFeaturesModel.deleteMany({});

      });

      test(`Return all countries since multitenancy enabled`, async () => {

        // Arrange

        await userFeaturesModel.create({ tagerIds: `${taagerID}`, feature: 'multitenancy_uae' });

        await userFeaturesModel.create({ tagerIds: `${taagerID}`, feature: 'multitenancy' });

        // Act

        const countryResponse = await request(app)

          .get('/api/countries')

          .set('Authorization', `Bearer ${accessToken}`);

        // Assert

        expect(countryResponse.statusCode).toEqual(200);

        expect(countryResponse.body.data.length).toEqual(3);

        expect(countryResponse.body.msg).toEqual('success');

      });

    });

  });

  afterAll(async () => {

    await userFeaturesModel.deleteMany({});

    await disconnectDefaultFromMongoDB();

    app = null;

  });

});

SonarQube™ technology is powered by SonarSource SA

    Developer EditionVersion 9.5 (build 56709)LGPL v3CommunityDocumentationPluginsWeb API


