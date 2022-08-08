import { setupServer, registerAndLogin } from '../expressServer/expressServer';

jest.mock('../../src/shared-kernel/infrastructure/config/Log');

import { GenericContainer } from 'testcontainers';
import request from 'supertest';
import Notification from '../../src/engagement/notifications/common/infrastructure/db/schemas/Notification';
import {
  connectDefaultConnectionToMongoDB,
  disconnectDefaultFromMongoDB,
} from '../../src/shared-kernel/infrastructure/config/mongoose';
import Env from '../../src/Env';
import CountryModel from '../../src/shared-kernel/infrastructure/db/models/CountrySchema';
import { countryFixture, UNITED_ARAB_EMIRATES, EGYPT } from '../fixtures/countryFixture';

Env.SECRET = 'yallahabibi';

describe('APIs', () => {
  let container;
  let app: any = null;
  let accessToken: string;
  let taagerId: number;

  const createCountries = async () => {
    await CountryModel.insertMany(countryFixture);
  };

  beforeAll(async () => {
    container = await new GenericContainer('mongo').withExposedPorts(27017).start();
    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}/bla`;
    await connectDefaultConnectionToMongoDB(mongoUri);
    app = setupServer();
    await createCountries();
    const response = await registerAndLogin(app);
    accessToken = response.data;
    taagerId = response.user.TagerID;
  });

  describe('Notification apis', () => {
    const createBulkNotification = async country => {
      const notification = {
        message: 'Some notification',
        type: 'bulk',
        country,
      };
      const savedNotification = await Notification.create(notification);

      return { ...notification, _id: String(savedNotification._id) };
    };

    const createPrivateNotificationFor = async (taagerId, country) => {
      const notification = {
        message: `Some notification for taager: ${taagerId}`,
        type: 'personal',
        taagerId,
        country,
      };
      const savedNotification = await Notification.create(notification);

      return { ...notification, _id: String(savedNotification._id) };
    };

    test('notifications flow', async () => {
      // Arrange
      const bulkNotificationEgy = await createBulkNotification(EGYPT.countryIsoCode3);
      const bulkNotificationUae = await createBulkNotification(UNITED_ARAB_EMIRATES.countryIsoCode3);
      const notification1Egy = await createPrivateNotificationFor(taagerId, EGYPT.countryIsoCode3);
      const notification2Egy = await createPrivateNotificationFor(taagerId, EGYPT.countryIsoCode3);
      const notification1Uae = await createPrivateNotificationFor(taagerId, UNITED_ARAB_EMIRATES.countryIsoCode3);
      await createPrivateNotificationFor(taagerId + 1, EGYPT.countryIsoCode3);
      await createPrivateNotificationFor(taagerId + 1, UNITED_ARAB_EMIRATES.countryIsoCode3);

      // Act
      const initialNotificationsBlankHeader = await request(app)
        .get('/api/notifications/taager')
        .set('Authorization', `Bearer ${accessToken}`);
      const initialNotificationsEGY = await request(app)
        .get('/api/notifications/taager')
        .set('country', 'EGY')
        .set('Authorization', `Bearer ${accessToken}`);
      const initialNotificationsARE = await request(app)
        .get('/api/notifications/taager')
        .set('country', 'ARE')
        .set('Authorization', `Bearer ${accessToken}`);

      await request(app)
        .post('/api/notifications/markAsRead')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          notificationIds: [{ _id: bulkNotificationEgy._id }, { _id: notification1Egy._id }],
        });

      // Second call is the same, but api should be idempotent so this should succeed
      await request(app)
        .post('/api/notifications/markAsRead')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          notificationIds: [{ _id: bulkNotificationEgy._id }, { _id: notification1Egy._id }],
        });

      const notificationsAfterRead = await request(app)
        .get('/api/notifications/taager')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(initialNotificationsBlankHeader.statusCode).toEqual(200);
      expect(initialNotificationsBlankHeader.body).toMatchObject({
        response: {
          data: {
            unReadNotifications: [notification2Egy, notification1Egy, bulkNotificationEgy],
            notifications: [notification2Egy, notification1Egy, bulkNotificationEgy],
          },
        },
      });

      expect(initialNotificationsEGY.statusCode).toEqual(200);
      expect(initialNotificationsEGY.body).toEqual(initialNotificationsBlankHeader.body);

      expect(initialNotificationsARE.statusCode).toEqual(200);
      expect(initialNotificationsARE.body).toMatchObject({
        response: {
          data: {
            unReadNotifications: [notification1Uae, bulkNotificationUae],
            notifications: [notification1Uae, bulkNotificationUae],
          },
        },
      });

      expect(notificationsAfterRead.statusCode).toEqual(200);
      expect(notificationsAfterRead.body).toMatchObject({
        response: {
          data: {
            unReadNotifications: [notification2Egy],
            notifications: [notification2Egy, notification1Egy, bulkNotificationEgy],
          },
        },
      });
    });
  });

  afterEach(async () => {
    await Notification.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDefaultFromMongoDB();
    container.stop();
  });
});


