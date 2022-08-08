import mongoose from 'mongoose';
import { UserRolesModel } from '../../../../../authentication/common/infrastructure/db/models/userRolesModel';
import { ProductModel } from '../../../../../content-management/queries/infrastructure/db/models/ProductModel';

export interface UserModel {
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  walletPassword?: string;
  resetWalletPasswordToken?: string;
  resetWalletPasswordTokenExpiry?: Date;
  verified?: boolean;
  userLevel: number;
  phoneNum?: string;
  deviceTokens: string[];
  listedProducts: (ProductModel['_id'] | ProductModel)[];
  userCollection: (ProductModel['_id'] | ProductModel)[];
  userReferrals: (UserModel['_id'] | UserModel)[];
  referralCode?: string;
  cart: (ProductModel['_id'] | ProductModel)[];
  referredBy?: UserModel['_id'] | UserModel;
  TagerID?: number;
  totalProfit?: number;
  InProcessProfit?: number;
  collectedProfit?: number;
  loyaltyProgram?: string;
  loyaltyChange?: string;
  socialId?: string;
  provider?: string;
  info?: any;
  userRole?: UserRolesModel['_id'] | UserRolesModel;
  _id: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}


