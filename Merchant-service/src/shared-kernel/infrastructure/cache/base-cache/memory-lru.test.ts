import Cache from './index';
import { CacheType, DefaultInMemoryCacheParameters } from './cacheModel';

describe('Get cacher using POJO', () => {
  test('Get in-memory LRU cacher when called with type memory', () => {
    // Arrange
    const cacheParametersImplemented = {
      options: DefaultInMemoryCacheParameters,
      type: CacheType.Memmory,
    };

    // Act

    const cache = Cache.resolve(cacheParametersImplemented);

    // Assert

    expect(cache).toBeInstanceOf(Cache.MemoryLRU);
    expect(cache.opts.ttl).toBe(cacheParametersImplemented.options.ttl);
    expect(cache.opts.max).toBe(cacheParametersImplemented.options.max);
  });
  test('Get null when called with cache type not implemented', () => {
    // Arrange
    const cacheParametersNotImplemented = {
      options: DefaultInMemoryCacheParameters,
      type: 'redis',
    };

    // Act

    const cache = Cache.resolve(cacheParametersNotImplemented);

    // Assert
    expect(cache).toBe(null);
  });
});


