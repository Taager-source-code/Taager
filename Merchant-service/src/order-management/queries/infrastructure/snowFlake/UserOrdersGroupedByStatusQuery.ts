import SnowFlakeQuery from './SnowFlakeQuery';

// noinspection SqlNoDataSourceInspection,SqlResolve
export default class UserOrdersGroupedByStatusQuery extends SnowFlakeQuery {
  constructor(tagerId, fromDate, toDate) {
    super(
      `SELECT TAAGER_DAILY_STATUS_COUNT.ORDER_STATUS,
                      sum(TAAGER_DAILY_STATUS_COUNT.N_ORDERS) as total
               from TAAGER_DAILY_STATUS_COUNT
               where TAAGER_DAILY_STATUS_COUNT.TAGER_ID = ?
                 and DAY between ? and ?
               group by TAAGER_DAILY_STATUS_COUNT.ORDER_STATUS`,
      [tagerId, fromDate, toDate],
    );
  }
}


