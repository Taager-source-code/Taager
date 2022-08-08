import { Service } from 'typedi';
import BlockedEndCustomersDao from '../db/access/BlockedEndCustomersDao';

@Service({ global: true })
export class BlockedEndCustomersRepoImpl {
  private blockedEndCustomersDao: BlockedEndCustomersDao;

  constructor(blockedEndCustomersDao: BlockedEndCustomersDao) {
    this.blockedEndCustomersDao = blockedEndCustomersDao;
  }

  /**
   * @description Attempt to find if End customer having these phonNumbers is Blocked
   * @param phoneNum1
   * @param phoneNum2
   */
  async findBlockedEndCustomerByPhone(phoneNum1, phoneNum2?) {
    return await this.blockedEndCustomersDao.findBlockedEndCustomerByPhone(phoneNum1, phoneNum2);
  }
}


