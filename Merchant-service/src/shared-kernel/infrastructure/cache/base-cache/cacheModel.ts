import Env from '../../../../Env';

export const CacheType = {
  Memmory: 'memoryLru',
};

export const DefaultInMemoryCacheParameters = {
  ttl: Number(Env.CACHE_TTL) || 300, // in seconds
  max: Number(Env.CACHE_MAX_ITEMS) || 10000, // max elements in cache
  stale: false,
  updateAgeOnGet: Env.CACHE_UPDATE_ITEMS_ONGET || false,
};


