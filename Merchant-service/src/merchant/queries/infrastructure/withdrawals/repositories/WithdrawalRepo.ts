import WithdrawalQuery from '../../../application/withdrawals/models/WithdrawalQuery';
import WithdrawalDao from '../../../../common/infrastructure/db/access/WithdrawalDao';
import { Service } from 'typedi';
import ListWithdrawalResult from '../../../application/withdrawals/models/ListWithdrawalResult';
import WithdrawalConverter from './WithdrawalConverter';
import { APP_STATUS_PENDING } from '../../../../common/application/WithdrawalStatus';
import { DB_STATUS_IN_PROGRESS } from '../../../../common/infrastructure/db/models/WithdrawalEntity';

@Service({ global: true })
export default class WithdrawalRepo {
  private withdrawalDao: WithdrawalDao;

  constructor(withdrawalDao: WithdrawalDao) {
    this.withdrawalDao = withdrawalDao;
  }

  async list(query: WithdrawalQuery): Promise<ListWithdrawalResult> {
    const options: any = { userId: query.userId };

    if (query.status && query.status.length != 0) {
      const statuses = query.status.map(status => WithdrawalConverter.statusToDB(status));
      if (this.hasPendingStatus(query.status)) statuses.push(DB_STATUS_IN_PROGRESS);
      options.status = { $in: statuses };
    }
    if (query.currency) options.currency = query.currency;

    if (query.toDate && query.fromDate) {
      options.createdAt = {
        $gte: query.fromDate,
        $lt: query.toDate,
      };
    }
    const requests = await this.withdrawalDao.getAll(options, query.page, query.pageSize);
    const count = await this.withdrawalDao.count(options);
    const withdrawals = requests.map(request => WithdrawalConverter.toApplication(request));
    return { withdrawals: withdrawals, count: count };
  }

  private hasPendingStatus(statuses: string[]) {
    return statuses.find(status => status == APP_STATUS_PENDING);
  }
}


