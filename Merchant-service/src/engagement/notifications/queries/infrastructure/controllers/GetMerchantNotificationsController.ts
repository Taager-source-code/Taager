import { Service } from 'typedi';
import { OK } from 'http-status';
import GetMerchantNotifications from '../../application/usecases/GetMerchantNotifications';
import { GetMerchantNotificationsRequest } from '../../application/models/GetMerchantNotificationsRequest';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import joi from 'joi';

@Service({ global: true })
export class GetMerchantNotificationsController extends HttpProcessor {
  private getMerchantNotifications: GetMerchantNotifications;

  constructor(getMerchantNotifications: GetMerchantNotifications) {
    super();
    this.getMerchantNotifications = getMerchantNotifications;
  }

  async execute(req): Promise<HttpSuccess | HttpError> {
    const { user } = req.decodedToken;
    const getMerchantNotificationsRequest: GetMerchantNotificationsRequest = {
      userId: user._id,
      taagerId: user.TagerID,
      countryIsoCode3: req.country.countryIsoCode3,
    };

    const response = await this.getMerchantNotifications.execute(getMerchantNotificationsRequest);

    return {
      status: OK,
      data: {
        response: {
          data: response,
        },
      },
    };
  }

  schema = joi.object().options({ allowUnknown: true, stripUnknown: true });
}



