import { Service } from 'typedi';

import mongoose from 'mongoose';

@Service({ global: true })
export class TransactionManager {
  async runTransactionally<Type>(functionToWrap: (session: any) => Type): Promise<Type> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const functionResult = await functionToWrap(session);
      await session.commitTransaction();
      return functionResult;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}


