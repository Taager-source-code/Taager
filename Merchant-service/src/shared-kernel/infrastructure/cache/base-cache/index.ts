import LRU from 'lru-cache';
import BaseCacher from './base';

class MemoryLRUCacher extends BaseCacher {
  private cache: LRU;
  /**
   * Constructor of Lru Memory Cacher
   * @param opts
   */
  constructor(opts) {
    super(opts);

    this.cache = new LRU({
      max: this.opts.max,
      stale: this.opts.stale,
      maxAge: this.opts.ttl ? this.opts.ttl * 1000 : null,
      updateAgeOnGet: this.opts.updateAgeOnGet ? this.opts.updateAgeOnGet : false,
    });
  }

  /**
   *
   * @returns {Promise<void>}
   */
  close() {
    clearInterval();
    return Promise.resolve();
  }

  /**
   * Get data from cache by key
   * @param key
   * @returns {null|*}
   */
  get(key) {
    const cacheKey = this.KeyGenerator(key);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    return null;
  }

  /**
   * Set data in cache
   * @param key
   * @param data
   * @param ttl
   */
  set(key, data, ttl) {
    const cacheKey = this.KeyGenerator(key);
    if (ttl == null) {
      this.cache.set(cacheKey, data, this.opts.ttl ? this.opts.ttl * 1000 : null);
    } else {
      this.cache.set(cacheKey, data, ttl ? ttl * 1000 : null);
    }
  }

  /**
   * Delete data in cache using key/keys
   * @param keys
   */
  del(keys: any) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    keyList.forEach(key => {
      this.cache.del(key);
    });
  }

  /**
   * Clears cache
   */
  clear() {
    this.cache.reset();
  }

  /**
   *
   * @returns {int} items in cache
   */

  itemCount() {
    return this.cache.itemCount();
  }
}
export = MemoryLRUCacher;


