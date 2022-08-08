import {
  Merchant,
  MerchantExperience,
} from '../../../../../../engagement/activity/commands/application/models/Merchant';
import {
  MerchantSignedUpEvent,
  SignUpSource,
} from '../../../../../../engagement/activity/commands/application/models/MerchantSignedUpEvent';
import { MerchantSignedInEvent } from '../../../../../../engagement/activity/commands/application/models/MerchantSignedInEvent';

export default class CustomerActivityConverter {
  public static convertMerchantSignUp(merchant, signUpSource: SignUpSource): MerchantSignedUpEvent {
    return {
      merchant: CustomerActivityConverter.convertMerchant(merchant),
      signUpSource: signUpSource,
    };
  }

  public static convertMerchantSignIn(merchant): MerchantSignedInEvent {
    return {
      merchant: CustomerActivityConverter.convertMerchant(merchant),
    };
  }

  private static convertMerchant(merchant): Merchant {
    return {
      taagerId: merchant.TagerID,
      fullName: merchant.fullName,
      email: merchant.email,
      phone: merchant.phoneNum,
      loyaltyProgram: merchant.loyaltyProgram.loyaltyProgram,
      merchantExperience: CustomerActivityConverter.convertMerchantExperience(merchant),
    };
  }

  private static convertMerchantExperience(constructUser): MerchantExperience {
    if (!constructUser.info) {
      return {};
    }
    return {
      currentJob: constructUser.info.currentJob,
      havePrevExperience: constructUser.info.havePrevExperience,
      yearsOfExperience: constructUser.info.yearsOfExperience,
      onlineMarketplace: constructUser.info.onlineMarketplace,
      expectedOrdersPerMonth: constructUser.info.expectedOrdersPerMonth,
    };
  }
}


