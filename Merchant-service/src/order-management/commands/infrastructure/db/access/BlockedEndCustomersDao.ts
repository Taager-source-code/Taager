import { Service } from 'typedi';
import BlockedEndCustomersSchema from '../../../../queries/infrastructure/db/schemas/BlockedEndCustomersSchema';
import { BlockedEndCustomersDbo } from '../models/BlockedEndCustomersDbo';

@Service({ global: true })
export default class BlockedEndCustomersDao {
  public async findBlockedEndCustomerByPhone(
    phoneNum1: string,
    phoneNum2: string,
  ): Promise<BlockedEndCustomersDbo | null> {
    return BlockedEndCustomersSchema.findOne({ phoneNumber: { $in: [phoneNum1, phoneNum2] } })
      .lean(true)
      .exec();
  }
}


