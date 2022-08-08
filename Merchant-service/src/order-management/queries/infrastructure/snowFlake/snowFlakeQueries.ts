import * as snowFlakeIntegration from './SnowFlakeIntegration';
import OrderStatusCount from '../../application/usecases/orders-summary/OrderStatusCount';
import UserOrdersGroupedByStatusQuery from './UserOrdersGroupedByStatusQuery';
import UserOperationsRatesQuery from './UserOperationsRatesQuery';
import UserOperationsCount from '../../application/usecases/orders-summary/UserOperationsCounts';
import SnowFlakeQuery from './SnowFlakeQuery';
import CacheManager from '../../../../shared-kernel/infrastructure/cache/base-cache';
import Env from '../../../../Env';

import { CacheType } from '../../../../shared-kernel/infrastructure/cache/base-cache/cacheModel';

const secsInMinute = 60;
export const MemoryCacheConfigs = {
  ttl: Number(Env.SNOWFLAKE_CACHE_TTL_IN_MINUTES) * secsInMinute,
  max: Number(Env.SNOWFLAKE_CACHE_MAX_ITEM),
  stale: false,
  updateAgeOnGet: Env.CACHE_UPDATE_ITEMS_ONGET || false,
};

const cache = CacheManager.resolve({
  options: MemoryCacheConfigs,
  type: CacheType.Memmory,
});

export async function getUserOrdersGroupedByStatus(tagerId, fromDate, toDate) {
  function mapToOrderStatusCount(rows) {
    return rows.map(row => OrderStatusCount.fromRow(row));
  }

  const snowFlakeQuery = new UserOrdersGroupedByStatusQuery(tagerId, fromDate, toDate);
  return executeQueryOrGetFromCache(snowFlakeQuery).then(mapToOrderStatusCount);
}

export function getUserOperationsRates(tagerId) {
  const snowFlakeQuery = new UserOperationsRatesQuery(tagerId);

  return executeQueryOrGetFromCache(snowFlakeQuery).then(UserOperationsCount.fromRow);
}

async function executeQueryOrGetFromCache(snowFlakeQuery: SnowFlakeQuery) {
  let queryResult = cache.get(snowFlakeQuery);
  if (queryResult == null) {
    queryResult = await snowFlakeIntegration.executeQuery(snowFlakeQuery);
    cache.set(snowFlakeQuery, queryResult);
  }
  return queryResult;
}


