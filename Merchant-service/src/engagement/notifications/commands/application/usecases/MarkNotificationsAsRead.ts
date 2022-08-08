import { Service } from 'typedi';
import MerchantNotificationReadRepo from '../../infrastructure/repositories/MerchantNotificationReadRepo';
import { MerchantNotificationBatchRead } from '../../domain/MerchantNotificationBatchRead';

@Service({ global: true })
export default class MarkNotificationsAsRead {
  private merchantNotificationReadRepo: MerchantNotificationReadRepo;

  constructor(merchantNotificationReadRepo: MerchantNotificationReadRepo) {
    this.merchantNotificationReadRepo = merchantNotificationReadRepo;
  }

  async execute(notificationReads: MerchantNotificationBatchRead) {
    return this.merchantNotificationReadRepo.save(notificationReads);
  }
}


