import { Service } from 'typedi';
import NotificationSchema from '../schemas/Notification';
import { Notification as NotificationModel } from '../models/Notification';

@Service({ global: true })
export default class NotificationDao {
  findMerchantNotifications = async (taagerId, countryIsoCode3): Promise<NotificationModel[]> => {
    const options = {
      $and: [{ $or: [{ taagerId: null }, { taagerId }] }, { country: countryIsoCode3 }],
    };
    return NotificationSchema.find(options)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();
  };
}


