import { Service } from 'typedi';
import { MerchantNotificationBatchRead } from '../../domain/MerchantNotificationBatchRead';
import MerchantNotificationReadsDao from '../../../common/infrastructure/db/access/MerchantNotificationReadsDao';

@Service({ global: true })
export default class MerchantNotificationReadRepo {
  private merchantNotificationReadsDao: MerchantNotificationReadsDao;

  constructor(merchantNotificationReadsDao: MerchantNotificationReadsDao) {
    this.merchantNotificationReadsDao = merchantNotificationReadsDao;
  }

  async save(notificationReads: MerchantNotificationBatchRead) {
    return this.merchantNotificationReadsDao.markNotificationsAsRead(
      notificationReads.notificationIds,
      notificationReads.taagerId,
      notificationReads.userId,
    );
  }
}


