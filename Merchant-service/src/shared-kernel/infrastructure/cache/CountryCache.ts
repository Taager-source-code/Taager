import { Service } from 'typedi';
import Env from '../../../Env';
import CacheManager from './base-cache';
import { CacheType } from './base-cache/cacheModel';
import { Country } from '../db/models/Country';

@Service({ global: true })
export class CountryCache {
  private cache;

  constructor() {
    const memoryCacheConfigs = {
      ttl: 60 * 60 * 24,
      max: 4,
      stale: false,
      updateAgeOnGet: Env.CACHE_UPDATE_ITEMS_ONGET || false,
    };

    this.cache = CacheManager.resolve({
      options: memoryCacheConfigs,
      type: CacheType.Memmory,
    });
  }

  getByIsoCode(isoCode: string): Country | null {
    return this.cache.get(isoCode);
  }
  set(country: Country): void {
    this.cache.set(country.countryIsoCode3, country);
    this.cache.set(country.countryIsoCode2, country);
  }
  getAll(): Country[] | null {
    return this.cache.get('all');
  }
  setAll(countries: Country[]): void {
    this.cache.set('all', countries);
  }
}


