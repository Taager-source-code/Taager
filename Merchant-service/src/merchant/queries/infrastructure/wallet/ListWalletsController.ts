import { Service } from 'typedi';
import joi, { Schema } from 'joi';
import { OK } from 'http-status';
import ListWallets from '../../application/wallet/usecases/ListWallets';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../common/http/HttpProcessor';

@Service({ global: true })
export class ListWalletsController extends HttpProcessor {
  private listWallets: ListWallets;

  constructor(listWallets: ListWallets) {
    super();
    this.listWallets = listWallets;
  }

  async execute(req): Promise<HttpSuccess | HttpError> {
    const result = await this.listWallets.execute(req.decodedToken.user, req.query.currency);
    return {
      status: OK,
      data: { data: result },
    };
  }

  getValueToValidate(req): any {
    return req.query;
  }

  schema: Schema = joi.object({
    currency: joi
      .string()
      .optional()
      .valid('EGP', 'AED', 'SAR'),
  });
}


