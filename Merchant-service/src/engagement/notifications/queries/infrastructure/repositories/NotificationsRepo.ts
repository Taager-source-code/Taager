import { Service } from 'typedi';
import NotificationDao from '../../../common/infrastructure/db/access/NotificationDao';
import { GetMerchantNotificationsRequest } from '../../application/models/GetMerchantNotificationsRequest';
import MerchantNotificationReadsDao from '../../../common/infrastructure/db/access/MerchantNotificationReadsDao';
import { Notification, MerchantNotifications } from '../../application/models/MerchantNotifications';
import { Notification as NotificationModel } from '../../../common/infrastructure/db/models/Notification';

@Service({ global: true })
export default class NotificationsRepo {
  private notificationDao: NotificationDao;
  private merchantNotificationReadsDao: MerchantNotificationReadsDao;

  constructor(notificationDao: NotificationDao, merchantNotificationReadsDao: MerchantNotificationReadsDao) {
    this.notificationDao = notificationDao;
    this.merchantNotificationReadsDao = merchantNotificationReadsDao;
  }

  async getNotifications(request: GetMerchantNotificationsRequest): Promise<MerchantNotifications> {
    const notifications = await this.notificationDao.findMerchantNotifications(
      request.taagerId,
      request.countryIsoCode3,
    );
    const notificationIds = notifications.map(n => n._id);

    const readNotifications = await this.merchantNotificationReadsDao.findMerchantNotificationsReads(
      request.userId,
      notificationIds,
    );

    // NotificationId is a mongoose ObjectId. These don't play well with sets, so the cast to String.
    const readNotificationSet = new Set(readNotifications.map(not => String(not.notificationId)));

    const unReadNotifications = notifications.filter(
      notification => !readNotificationSet.has(String(notification._id)),
    );

    return {
      notifications: notifications.map(n => NotificationsRepo.convert(n)),
      unReadNotifications: unReadNotifications.map(n => NotificationsRepo.convert(n)),
    };
  }

  private static convert(notificationModel: NotificationModel): Notification {
    return { ...notificationModel, _id: String(notificationModel._id) };
  }
}


