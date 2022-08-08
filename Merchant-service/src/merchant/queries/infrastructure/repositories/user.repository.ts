import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import UserModel from '../../../common/infrastructure/db/schemas/user.model';

const mongooseServiceInstance = new MongooseService(UserModel);

export async function findUserById(id) {
  try {
    const projection = {
      __v: 0,
      password: 0,
      verificationToken: 0,
      resetPasswordToken: 0,
      resetPasswordTokenExpiry: 0,
      resetWalletPasswordToken: 0,
      resetWalletPasswordTokenExpiry: 0,
      walletPassword: 0,
      verificationTokenExpiry: 0,
      userRole: 0,
      loyaltyChange: 0,
      InProcessProfit: 0,
      collectedProfit: 0,
      listedProducts: 0,
      userCollection: 0,
      userReferrals: 0,
    };
    return await mongooseServiceInstance.findById(id, projection);
  } catch (err) {
    return err;
  }
}


