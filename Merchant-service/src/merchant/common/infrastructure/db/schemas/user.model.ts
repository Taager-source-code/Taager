/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';
import { UserModel } from '../models/userModel';

const autoIncrement = new AutoIncrement(mongoose);

const userSchema = new mongoose.Schema<UserModel>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: false,
    },
    password: {
      type: String,
      trim: true,
    },
    profilePicture: String,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,
    walletPassword: {
      type: String,
      trim: true,
    },
    resetWalletPasswordToken: String,
    resetWalletPasswordTokenExpiry: Date,
    verified: {
      type: Boolean,
      default: false,
    },
    userLevel: {
      type: Number,
      required: true,
    },
    phoneNum: {
      type: String,
      unique: true,
      dropDups: true,
    },
    deviceTokens: {
      type: [String],
      required: false,
      default: [],
    },
    listedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
    userCollection: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
    userReferrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    referralCode: {
      type: String,
      required: false,
      unique: true,
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
      },
    ],
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    TagerID: {
      type: Number,
      required: false,
    },
    totalProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    InProcessProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    collectedProfit: {
      type: Number,
      required: false,
      default: 0,
    },
    loyaltyProgram: {
      type: String,
      required: false,
      default: 'BLUE',
    },
    loyaltyChange: {
      type: String,
      required: false,
      default: 'automatic',
    },
    socialId: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
    },
    info: {
      type: Object,
      trim: true,
      required: false,
    },
    userRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserRoles',
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordTokenExpiry;
        delete ret.walletPassword;
        delete ret.resetWalletPasswordToken;
        delete ret.resetWalletPasswordTokenExpiry;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiry;
        return ret;
      },
    },
  },
);

userSchema.plugin(autoIncrement, {
  id: 'id_counter',
  inc_field: 'TagerID',
  disable_hooks: true,
  start_seq: 100,
  inc_amount: 1,
}); // Field is only added to userLevel 1 at registration in controller

export default mongoose.model<UserModel>('User', userSchema);


