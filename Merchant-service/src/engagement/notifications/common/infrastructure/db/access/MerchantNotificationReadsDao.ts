import { Service } from 'typedi';
import NotificationReadSchema from '../schemas/MerchantNotificationRead';
import { MerchantNotificationRead as MerchantNotificationReadModel } from '../models/MerchantNotificationRead';

@Service({ global: true })
export default class MerchantNotificationReadsDao {
  findMerchantNotificationsReads = async (merchantId, notificationIds): Promise<MerchantNotificationReadModel[]> => {
    return await NotificationReadSchema.find({
      merchantId,
      notificationId: { $in: notificationIds },
    })
      .lean()
      .exec();
  };

  markNotificationsAsRead = async (notificationIds, taagerId, merchantId) => {
    const mapped = notificationIds.map(notificationId => {
      return {
        updateOne: {
          filter: {
            notificationId,
            merchantId,
          },
          update: {
            $set: {
              notificationId,
              merchantId,
              taagerId,
            },
          },
          upsert: true,
        },
      };
    });
    return NotificationReadSchema.bulkWrite(mapped);
  };
}


