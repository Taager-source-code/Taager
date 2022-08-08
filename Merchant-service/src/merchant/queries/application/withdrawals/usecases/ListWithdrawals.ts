import WithdrawalQuery from '../models/WithdrawalQuery';
import WithdrawalRepo from '../../../infrastructure/withdrawals/repositories/WithdrawalRepo';
import { Service } from 'typedi';
import ListWithdrawalResult from '../models/ListWithdrawalResult';

@Service({ global: true })
export default class ListWithdrawals {
  private withdrawalRepo: WithdrawalRepo;

  constructor(withdrawalRepo: WithdrawalRepo) {
    this.withdrawalRepo = withdrawalRepo;
  }

  async execute(query: WithdrawalQuery): Promise<ListWithdrawalResult> {
    return this.withdrawalRepo.list(query);
  }
}


