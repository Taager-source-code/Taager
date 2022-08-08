import WithdrawalDao from '../../../../common/infrastructure/db/access/WithdrawalDao';
import { Service } from 'typedi';
import Withdrawal from '../../../domain/withdrawals/Withdrawal';
import WithdrawalConverter from '../converteres/WithdrawalConverter';

@Service({ global: true })
export default class WithdrawalRepo {
  private withdrawalDao: WithdrawalDao;

  constructor(withdrawalDao: WithdrawalDao) {
    this.withdrawalDao = withdrawalDao;
  }

  async save(withdrawal: Withdrawal) {
    await this.withdrawalDao.save(WithdrawalConverter.toDB(withdrawal));
  }
  async getById(withdrawalId: string): Promise<Withdrawal | null> {
    const entity = await this.withdrawalDao.getByWithdrawalId(withdrawalId);
    if (!entity) return null;
    return WithdrawalConverter.toDomain(entity);
  }
}


