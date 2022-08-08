import SnowFlakeQuery from './SnowFlakeQuery';

// noinspection SqlNoDataSourceInspection,SqlResolve
export default class UserOperationsRatesQuery extends SnowFlakeQuery {
  constructor(tagerId) {
    super(
      `SELECT
                      sum(TAAGER_DAILY_STATUS_COUNT.N_ORDERS) as total_orders_count,
                      sum(TAAGER_DAILY_STATUS_COUNT.N_CONFIRMED_ORDERS) as total_confirmed_orders,
                      sum(TAAGER_DAILY_STATUS_COUNT.N_DELIVERED_ORDERS) as total_delivered_orders
               from TAAGER_DAILY_STATUS_COUNT
               where TAAGER_DAILY_STATUS_COUNT.TAGER_ID = ?`,
      [tagerId],
    );
  }
}


