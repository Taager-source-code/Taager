import { Service } from 'typedi';
import { Country } from '../db/models/Country';
import CountryDao from '../db/access/CountryDao';
import { CountryCache } from '../cache/CountryCache';
import Logger from '../logging/general.log';

@Service({ global: true })
export default class CountryRepo {
  private countryDoa: CountryDao;
  private countryCache: CountryCache;

  constructor(countryDoa: CountryDao, countryCache: CountryCache) {
    this.countryDoa = countryDoa;
    this.countryCache = countryCache;
  }

  async getCountries(): Promise<Country[]> {
    const cachedCountries = this.countryCache.getAll();

    if (cachedCountries == null) {
      Logger.info('Retrieving countries from DB', { context: 'Country' });

      const dbCountries = await this.countryDoa.getCountries();
      this.countryCache.setAll(dbCountries);
      return dbCountries;
    }

    Logger.info('Retrieving countries from Cache', { context: 'Country' });

    return cachedCountries;
  }

  async getByIsoCode(isoCode: string): Promise<Country | null> {
    const cachedCountry = this.countryCache.getByIsoCode(isoCode);

    if (cachedCountry == null) {
      Logger.info('Retrieving country from DB', {
        context: 'Country',
        isoCode: isoCode,
      });

      const dbCountry = await this.countryDoa.getByIsoCode(isoCode);
      if (dbCountry) this.countryCache.set(dbCountry);
      return dbCountry;
    }

    Logger.info('Retrieving country from Cache', {
      context: 'Country',
      isoCode: isoCode,
    });

    return cachedCountry;
  }
}


