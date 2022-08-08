import { CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from 'http-status';

import Logger from '../../../../../shared-kernel/infrastructure/logging/general.log';
import { isObjectId, isString } from '../../utils/validations';
import { addUserWallet } from '../../../../../merchant/commands/application/usecases/userWallet.service';
import {
  createUser,
  findUser,
  findUserAndUpdate,
  findUserById,
  findUserByIdAndUpdate,
  findUserForLogin,
  save,
} from '../../../../../merchant/queries/application/usecases/user.service';
import {
  checkForCorrectPassword,
  encryptPassword,
  genReferralCode,
  genResetPasswordToken,
  genResetWalletPasswordToken,
  genVerificationToken,
  signJWT,
} from '../../../application/usecases/auth.service';
import { validateToken } from '../../../application/usecases/socialAuth.service';
import upload from '../../../../../shared-kernel/infrastructure/services/file-upload';
import * as authValidator from './auth.validator';
import { getUserFeaturesAndLoyalty } from '../../../../../merchant/queries/application/usecases/user/user.service';
import { Container } from 'typedi';
import SendResetPasswordEmail from '../../../../../email/application/usecases/SendResetPasswordEmail';
import SendResetWalletPasswordEmail from '../../../../../email/application/usecases/SendResetWalletPasswordEmail';
import { MerchantSignedUpEventHandler } from '../../../../../engagement/activity/commands/application/usecases/MerchantSignedUpEventHandler';
import { SignUpSource } from '../../../../../engagement/activity/commands/application/models/MerchantSignedUpEvent';
import { MerchantSignedInEventHandler } from '../../../../../engagement/activity/commands/application/usecases/MerchantSignedInEventHandler';
import CustomerActivityConverter from './converters/CustomerActivityConverter';

const singleUpload = upload.single('image');

const socialAuthSignInCodes = Object.freeze({
  YOU_ARE_NOT_AUTHORIZED: 1,
  CANT_CREATE_ID_FOR_TAGER: 2,
  GENERAL_ERROR: 100,
});

const registerCodes = Object.freeze({
  FULL_NAME_IS_REQUIRED: 1,
  PASSWORD_IS_REQUIRED_AND_PASSWORD_MUST_BE_AT_LEAST_9_CHARACTERS: 2,
  PHONE_NUM_IS_REQUIRED: 3,
  USERNAME_OR_EMAIL_OR_PHONE_ALREADY_TAKEN: 4,
  CANT_CREATE_ID_FOR_TAGER: 5,
  GENERAL_ERROR: 100,
});

const loginCodes = Object.freeze({
  INVALID_USERNAME_OR_PASSWORD: 1,
  YOU_ARE_NOT_AUTHORIZED: 2,
  GENERAL_ERROR: 100,
});

const walletLoginCodes = Object.freeze({
  ACCOUNT_NOT_FOUND: 1,
  WRONG_DATA_ENTERD: 2,
  YOU_ARE_NOT_AUTHORIZED: 3,
  GENERAL_ERROR: 100,
});

const changeWalletPasswordCodes = Object.freeze({
  ACCOUNT_NOT_FOUND: 1,
  YOU_HAVE_TO_LOGIN_TO_WALLET_FOR_THE_FIRST_TIME: 2,
  CURRENT_WALLET_PASSWORD_IS_INCORRECT: 3,
  GENERAL_ERROR: 100,
});

const resendVerificationEmailCodes = Object.freeze({
  EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_PENDING_ACCOUNTS: 1,
  GENERAL_ERROR: 100,
});

const verifyAccountCodes = Object.freeze({
  VERIFICATION_TOKEN_PARAMETER_MUST_BE_VALID_STRING: 1,
  VERIFICATION_TOKEN_IS_INVALID_OR_HAS_EXPIRED: 2,
  GENERAL_ERROR: 100,
});

const forgotPasswordCodes = Object.freeze({
  EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_EXISTING_ACCOUNT: 1,
  GENERAL_ERROR: 100,
});

const forgotWalletPasswordCodes = Object.freeze({
  EMAIL_IS_NOT_PROVIDED: 1,
  EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_EXISTING_ACCOUNT: 2,
  GENERAL_ERROR: 100,
});

const checkResetPasswordTokenCodes = Object.freeze({
  RESET_PASSWORD_TOKEN_IS_INVALID_OR_HAS_EXPIRED: 1,
  RESETPASSWORDTOKEN_PARAMETER_MUST_BE_VALID_STRING: 2,
  GENERAL_ERROR: 100,
});

const resetPasswordCodes = Object.freeze({
  USER_ID_AND_RESET_PASSWORD_TOKEN_MUST_BE_VALID: 1,
  ACCOUNT_NOT_FOUND: 2,
  GENERAL_ERROR: 100,
});

const resetWalletPasswordCodes = Object.freeze({
  USER_ID_AND_RESET_WALLET_PASSWORD_TOKEN_MUST_BE_VALID: 1,
  ACCOUNT_NOT_FOUND: 2,
  GENERAL_ERROR: 100,
});

const changePasswordCodes = Object.freeze({
  CURRENT_PASSWORD_IS_INCORRECT: 1,
  ACCOUNT_NOT_FOUND: 2,
  GENERAL_ERROR: 100,
});

const getUserByReferralCodeCodes = Object.freeze({
  NOT_FOUND: 1,
});

export const socialAuthSignIn = async (req, res) => {
  const { error, body } = authValidator.validatesocialAuthSignInCredentials(req);
  Logger.info('User tried logging in', { username: body.name });

  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: socialAuthSignInCodes.GENERAL_ERROR,
    });
  }

  await validateToken(body.provider, body.token || body.idToken || body.authToken, body.email);

  const user = await findUserForLogin(
    {
      $or: [
        {
          socialId: body.id,
        },
        {
          email: body.email,
        },
        {
          username: body.email,
        },
      ],
    },
    true,
  );
  if (user) {
    const token = await signJWT(user, false);
    const constructUser = await getUserFeaturesAndLoyalty(user);

    await Container.of()
      .get(MerchantSignedInEventHandler)
      .execute(CustomerActivityConverter.convertMerchantSignIn(constructUser));

    return res.status(OK).json({
      data: token,
      user: constructUser,
    });
  }
  const newUser = {};
  Object.assign(
    newUser,
    {
      fullName: req.body.name,
      userLevel: 1,
      firstName: req.body.name,
      lastName: '.',
      username: req.body.email,
      email: req.body.email,
      socialId: req.body.id,
      profilePicture: req.body.photoUrl,
      provider: req.body.provider,
    },
    await genVerificationToken(),
    await genReferralCode(),
  );
  const newUserObject = await createUser(newUser);
  const walletObj = {
    userID: newUserObject._id,
    totalProfit: 0,
    countOrders: 0,
    eligibleProfit: 0,
    deliveredOrders: 0,
    inprogressProfit: 0,
    inprogressOrders: 0,
    incomingProfit: 0,
    receivedOrders: 0,
    currency: 'EGP',
  };
  await addUserWallet(walletObj);
  // @ts-ignore
  await newUserObject.setNext('id_counter', async function(err) {
    if (err) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        code: socialAuthSignInCodes.CANT_CREATE_ID_FOR_TAGER,
      });
    }
    const user = await findUserForLogin({ socialId: newUserObject.socialId }, true);
    if (!user) throw new Error('User not found!');
    const token = await signJWT(user, false);

    const constructUser = await getUserFeaturesAndLoyalty(user);

    await Container.of()
      .get(MerchantSignedUpEventHandler)
      .execute(CustomerActivityConverter.convertMerchantSignUp(constructUser, SignUpSource.Social));

    return res.status(CREATED).json({
      data: token,
      user: constructUser,
    });
  });
};

export const register = async (req, res) => {
  const { error, body } = authValidator.validateUserRegisterCredentials(req);
  Logger.info('User register request received', {
    username: body.fullName,
    email: body.email,
  });
  if (error) {
    if (error.details[0].message.includes('fullName')) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        code: registerCodes.FULL_NAME_IS_REQUIRED,
      });
    }
    if (error.details[0].message.includes('password')) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        code: registerCodes.PASSWORD_IS_REQUIRED_AND_PASSWORD_MUST_BE_AT_LEAST_9_CHARACTERS,
      });
    }
    if (error.details[0].message.includes('phoneNum')) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        code: registerCodes.PHONE_NUM_IS_REQUIRED,
      });
    }
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: registerCodes.GENERAL_ERROR,
    });
  }
  const query: any = {
    $or: [
      {
        phoneNum: body.phoneNum,
      },
    ],
  };
  if (req.body.email) {
    query.$or.push({
      email: req.body.email,
    });
  }
  let user = await findUser(query);

  if (user) {
    return res.status(CONFLICT).json({
      code: registerCodes.USERNAME_OR_EMAIL_OR_PHONE_ALREADY_TAKEN,
    });
  }
  if (req.body.referredBy === null || req.body.referredBy === '') {
    delete req.body.referredBy;
  }
  Object.assign(
    body,
    {
      password: await encryptPassword(body.password),
      userLevel: 1,
      firstName: body.fullName,
      lastName: '.',
      username: body.phoneNum,
      email: body.email,
      referredBy: req.body.referredBy,
      info: req.body.info,
    },
    await genVerificationToken(),
    await genReferralCode(),
  );
  user = await createUser(body);

  const walletObj = {
    userID: user._id,
    totalProfit: 0,
    countOrders: 0,
    eligibleProfit: 0,
    deliveredOrders: 0,
    inprogressProfit: 0,
    inprogressOrders: 0,
    incomingProfit: 0,
    receivedOrders: 0,
    currency: 'EGP',
  };

  await addUserWallet(walletObj);

  // @ts-ignore
  await user.setNext('id_counter', async function(err, result) {
    if (err) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        code: registerCodes.CANT_CREATE_ID_FOR_TAGER,
      });
    }

    const user = await findUser({ _id: result._id });
    if (user == null) throw new Error('User not found!');

    const constructUser = await getUserFeaturesAndLoyalty(user);

    await Container.of()
      .get(MerchantSignedUpEventHandler)
      .execute(CustomerActivityConverter.convertMerchantSignUp(constructUser, SignUpSource.Normal));

    res.status(CREATED).json({
      msg: `Welcome, ${user.username}, your registration was successful.`,
      user: constructUser,
    });
  });
};

export const login = async (req, res) => {
  const { error, body } = authValidator.validateLoginCredentials(req);

  Logger.info('User tried logging in', { username: body.username });

  if (error) {
    return res.status(UNAUTHORIZED).json({
      code: loginCodes.INVALID_USERNAME_OR_PASSWORD,
    });
  }

  const user = await findUserForLogin(
    {
      $or: [
        {
          username: body.username,
        },
        {
          email: body.username,
        },
        {
          phoneNum: body.username,
        },
      ],
    },
    true,
  );

  if (!user) {
    return res.status(UNAUTHORIZED).json({
      code: loginCodes.INVALID_USERNAME_OR_PASSWORD,
    });
  }

  const passwordMatches = await checkForCorrectPassword(body.password, user.username);

  if (!passwordMatches) {
    return res.status(UNAUTHORIZED).json({
      code: loginCodes.INVALID_USERNAME_OR_PASSWORD,
    });
  }

  const token = await signJWT(user, body.rememberMe);

  const constructUser = await getUserFeaturesAndLoyalty(user);

  await Container.of()
    .get(MerchantSignedInEventHandler)
    .execute(CustomerActivityConverter.convertMerchantSignIn(constructUser));

  res.status(OK).json({
    msg: `Welcome, ${user.username}.`,
    data: token,
    user: constructUser,
  });
};

export const walletLogin = async (req, res) => {
  const { error, body } = authValidator.validateWalletLoginCredentials(req);
  Logger.info('User tried logging in to wallet service', {
    username: body.username,
  });
  if (error) {
    Logger.error(`Wallet login error: ${error.details[0].message}`);
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: walletLoginCodes.GENERAL_ERROR,
    });
  }
  const user = await findUser(
    {
      $or: [
        {
          username: body.username,
        },
        {
          email: body.username,
        },
        {
          phoneNum: body.username,
        },
      ],
    },
    true,
  );
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: walletLoginCodes.ACCOUNT_NOT_FOUND,
    });
  }
  if (!user.walletPassword) {
    user.walletPassword = user.password;
    await save(user);
  }
  const passwordMatches = await checkForCorrectPassword(body.password, user.username, true);
  if (!passwordMatches) {
    return res.status(NOT_FOUND).json({
      code: walletLoginCodes.WRONG_DATA_ENTERD,
    });
  }
  res.status(OK).json({
    msg: `Welcome, ${user.username} in your Wallet`,
  });
};

export const changeWalletPassword = async (req, res) => {
  const { error, body } = authValidator.validateChangeWalletPasswordRequest(req);
  Logger.info('User tried to change Wallet Password', {
    username: body.username,
  });
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: changeWalletPasswordCodes.GENERAL_ERROR,
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: changeWalletPasswordCodes.ACCOUNT_NOT_FOUND,
    });
  }
  if (!user.walletPassword) {
    return res.status(NOT_FOUND).json({
      code: changeWalletPasswordCodes.YOU_HAVE_TO_LOGIN_TO_WALLET_FOR_THE_FIRST_TIME,
    });
  }
  const passwordMatches = await checkForCorrectPassword(body.currentWalletPassword, user.username, true);
  if (!passwordMatches) {
    return res.status(FORBIDDEN).json({
      code: changeWalletPasswordCodes.CURRENT_WALLET_PASSWORD_IS_INCORRECT,
    });
  }
  user.walletPassword = await encryptPassword(body.newWalletPassword);
  await user.save();
  res.status(OK).json({
    msg: 'Wallet Password was changed successfully.',
  });
};

export const resendVerificationEmail = async (req, res) => {
  const { error, body } = authValidator.validateResendVerificationEmailRequest(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: resendVerificationEmailCodes.GENERAL_ERROR,
    });
  }
  const user = await findUser(
    {
      email: body.email,
    },
    false,
  );
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: resendVerificationEmailCodes.EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_PENDING_ACCOUNTS,
    });
  }
  Object.assign(user, await genVerificationToken());
  await save(user);
  res.status(OK).json({
    msg: 'Email was sent successfully, please check your inbox to verify your account.',
  });
};

export const verifyAccount = async (req, res) => {
  const { error, params } = authValidator.validateVerifyAccount(req);

  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: verifyAccountCodes.VERIFICATION_TOKEN_PARAMETER_MUST_BE_VALID_STRING,
    });
  }

  if (!isString(params.verificationToken)) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: verifyAccountCodes.VERIFICATION_TOKEN_PARAMETER_MUST_BE_VALID_STRING,
    });
  }
  const user = await findUserAndUpdate({
    query: {
      verificationToken: params.verificationToken,
      verificationTokenExpiry: {
        $gt: new Date(),
      },
    },
    update: {
      $set: {
        verified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    },
  });
  if (!user) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: verifyAccountCodes.VERIFICATION_TOKEN_IS_INVALID_OR_HAS_EXPIRED,
    });
  }
  res.status(OK).json({
    msg: 'Account was verified successfully.',
  });
};

export const forgotPassword = async (req, res) => {
  const { error, body } = authValidator.validateForgotPasswordRequest(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: forgotPasswordCodes.GENERAL_ERROR,
    });
  }
  const user = await findUser(body, true);
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: forgotPasswordCodes.EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_EXISTING_ACCOUNT,
    });
  }
  Object.assign(user, await genResetPasswordToken());
  await save(user);
  await Container.of()
    .get(SendResetPasswordEmail)
    .execute({
      userId: user._id.toString(),
      resetPasswordToken: user.resetPasswordToken,
      email: user.email,
      username: user.username,
    });
  res.status(OK).json({
    msg: 'An email with further instructions on how to reset your password was sent to you, check your inbox!',
  });
};
export const forgotWalletPassword = async (req, res) => {
  const { error, body } = authValidator.validateForgotWalletPassword(req);

  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: forgotWalletPasswordCodes.EMAIL_IS_NOT_PROVIDED,
    });
  }

  const { email } = body;
  if (!email) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: forgotWalletPasswordCodes.EMAIL_IS_NOT_PROVIDED,
    });
  }
  const user = await findUser({ email }, true);
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: forgotWalletPasswordCodes.EMAIL_IS_NOT_ASSOCIATED_WITH_ANY_EXISTING_ACCOUNT,
    });
  }
  Object.assign(user, await genResetWalletPasswordToken());
  await save(user);
  await Container.of()
    .get(SendResetWalletPasswordEmail)
    .execute({
      userId: user._id.toString(),
      resetWalletPasswordToken: user.resetWalletPasswordToken,
      email: user.email,
      username: user.username,
    });
  res.status(OK).json({
    msg: 'An email with further instructions on how to reset your wallet password was sent to you, check your inbox!',
  });
};

export const checkResetPasswordToken = async (req, res) => {
  const { error, params } = authValidator.validateCheckResetPasswordToken(req);

  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: checkResetPasswordTokenCodes.RESETPASSWORDTOKEN_PARAMETER_MUST_BE_VALID_STRING,
    });
  }

  if (!isString(params.resetPasswordToken)) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: checkResetPasswordTokenCodes.RESETPASSWORDTOKEN_PARAMETER_MUST_BE_VALID_STRING,
    });
  }
  const user = await findUser({
    resetPasswordToken: params.resetPasswordToken,
    resetPasswordTokenExpiry: {
      $gt: new Date(),
    },
  });
  if (!user) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: checkResetPasswordTokenCodes.RESET_PASSWORD_TOKEN_IS_INVALID_OR_HAS_EXPIRED,
    });
  }
  res.status(OK).json({
    msg: 'You can now reset your password.',
    data: user._id,
  });
};
export const resetPassword = async (req, res) => {
  if (!(isObjectId(req.params.userId) && isString(req.params.resetPasswordToken))) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: resetPasswordCodes.USER_ID_AND_RESET_PASSWORD_TOKEN_MUST_BE_VALID,
    });
  }
  const { error, body } = authValidator.validateResetPasswordRequest(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: resetPasswordCodes.GENERAL_ERROR,
    });
  }
  const user = await findUserAndUpdate({
    query: {
      _id: req.params.userId,
      resetPasswordToken: req.params.resetPasswordToken,
      resetPasswordTokenExpiry: {
        $gt: new Date(),
      },
    },
    update: {
      $set: {
        password: await encryptPassword(body.password),
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    },
  });
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: resetPasswordCodes.ACCOUNT_NOT_FOUND,
    });
  }
  res.status(OK).json({
    msg: 'Password was reset successfully.',
  });
};
export const resetWalletPassword = async (req, res) => {
  if (!(isObjectId(req.params.userId) && isString(req.params.resetWalletPasswordToken))) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: resetWalletPasswordCodes.USER_ID_AND_RESET_WALLET_PASSWORD_TOKEN_MUST_BE_VALID,
    });
  }
  const { error, body } = authValidator.validateResetPasswordRequest(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: resetWalletPasswordCodes.GENERAL_ERROR,
    });
  }
  const user = await findUserAndUpdate({
    query: {
      _id: req.params.userId,
      resetWalletPasswordToken: req.params.resetWalletPasswordToken,
      resetWalletPasswordTokenExpiry: {
        $gt: new Date(),
      },
    },
    update: {
      $set: {
        walletPassword: await encryptPassword(body.password),
        resetWalletPasswordToken: null,
        resetWalletPasswordTokenExpiry: null,
      },
    },
  });
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: resetWalletPasswordCodes.ACCOUNT_NOT_FOUND,
    });
  }
  res.status(OK).json({
    msg: 'Wallet Password was reset successfully.',
  });
};
export const changePassword = async (req, res) => {
  const { error, body } = authValidator.validateChangePasswordRequest(req);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      code: changePasswordCodes.GENERAL_ERROR,
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (!user) {
    return res.status(NOT_FOUND).json({
      code: changePasswordCodes.ACCOUNT_NOT_FOUND,
    });
  }
  const passwordMatches = await checkForCorrectPassword(body.currentPassword, user.username);
  if (!passwordMatches) {
    return res.status(FORBIDDEN).json({
      code: changePasswordCodes.CURRENT_PASSWORD_IS_INCORRECT,
    });
  }
  user.password = await encryptPassword(body.newPassword);
  await user.save();
  res.status(OK).json({
    msg: 'Password was changed successfully.',
  });
};
export const updatePic = async (req, res) => {
  let data;
  singleUpload(req, res, async function(err) {
    if (!err && req.file) {
      data = req.file;
      const user = data.originalname;
      findUserAndUpdate({
        query: {
          $or: [
            {
              username: user,
            },
            {
              email: user,
            },
            {
              phoneNum: user,
            },
          ],
        },
        update: {
          $set: {
            profilePicture: data.location,
          },
        },
        lean: false,
        options: {
          new: false,
        },
      }).then(() => {
        req.decodedToken.user.profilePicture = data.location;
        res.status(CREATED).json({
          msg: data.location,
        });
      });
    }
  });
};

export const getUserByReferralCode = async (req, res) => {
  const { error, params } = authValidator.validateGetUserByReferralCode(req);

  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }

  const user = await findUser({
    referralCode: params.id,
  });
  if (user) {
    return res.status(OK).json({
      data: user,
    });
  }
  return res.status(NOT_FOUND).json({
    code: getUserByReferralCodeCodes.NOT_FOUND,
  });
};

export const generateReferralCode = async (req, res) => {
  const referral = (await genReferralCode()).referralCode;

  await findUserByIdAndUpdate({
    id: req.body._id,
    update: {
      $set: {
        referralCode: referral,
      },
    },
    options: {
      new: false,
    },
    lean: false,
  });
  return res.status(CREATED).json({
    msg: `User Updated successfully.`,
  });
};


