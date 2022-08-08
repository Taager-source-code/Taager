import { Service } from 'typedi';
import { OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import MarkNotificationsAsRead from '../../application/usecases/MarkNotificationsAsRead';
import joi, { Schema } from 'joi';
import { MerchantNotificationBatchRead } from '../../domain/MerchantNotificationBatchRead';

@Service({ global: true })
export class MarkNotificationsAsReadController extends HttpProcessor {
  private markNotificationsAsRead: MarkNotificationsAsRead;

  constructor(markNotificationsAsRead: MarkNotificationsAsRead) {
    super();
    this.markNotificationsAsRead = markNotificationsAsRead;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    const { user } = req.decodedToken;
    const notificationBatchRead: MerchantNotificationBatchRead = {
      notificationIds: joiValidatedValue.notificationIds,
      userId: user._id,
      taagerId: user.TaagerID,
    };

    await this.markNotificationsAsRead.execute(notificationBatchRead);

    return {
      status: OK,
      data: 'Notifications marked successfully',
    };
  }

  schema: Schema = joi.object({
    notificationIds: joi.array().items(joi.object()),
  });
}



