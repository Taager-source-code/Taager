import CurrencyModel from '../db/models/CurrencySchema';
import { Currency } from '../db/models/Currency';

export default class CurrencyRepo {
  getByIsoCode(isoCode: string): Promise<Currency | null> {
    return CurrencyModel.findOne({ currencyIsoCode: isoCode }).exec();
  }
}


