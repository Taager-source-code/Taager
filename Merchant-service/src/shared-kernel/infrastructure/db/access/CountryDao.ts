import { Service } from 'typedi';
import { Country } from '../models/Country';
import CountryModel from '../models/CountrySchema';

@Service({ global: true })
export default class CountryDao {
  getCountries(): Promise<Country[]> {
    return CountryModel.find().exec();
  }

  /**
   * Supports isoCode3 or isoCode2
   * @param isoCode
   */
  getByIsoCode(isoCode: string): Promise<Country | null> {
    return CountryModel.findOne({
      $or: [{ countryIsoCode3: isoCode }, { countryIsoCode2: isoCode }],
    }).exec();
  }
}


