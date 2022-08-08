import { addHours } from 'date-fns';
import jwt from 'jsonwebtoken';
import { hashPassword, genToken, comparePasswordToHash } from '../../infrastructure/utils/encryption';
import { isString } from '../../infrastructure/utils/validations';

import { findUserPassword } from '../../../../merchant/queries/application/usecases/user.service';
import Env from '../../../../Env';

export const extractToken = authHeader => {
  if (!isString(authHeader)) {
    return null;
  }
  const headerParts = authHeader.trim().split(' ');
  if (!(headerParts.length === 2 && headerParts[0] === 'Bearer')) {
    return null;
  }
  return headerParts[1];
};

const verifyTokenInternal = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, Env.SECRET, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });

export const isAuthenticated = token => verifyTokenInternal(token);

export const isNotAuthenticated = async token => {
  try {
    await verifyTokenInternal(token);
    return Promise.reject();
  } catch (err) {
    return Promise.resolve();
  }
};

export const encryptPassword = hashPassword;

export const genReferralCode = async () => ({
  referralCode: await genToken(8, 'hex'),
});

export const genVerificationToken = async () => ({
  verificationToken: await genToken(32, 'hex'),
  verificationTokenExpiry: addHours(new Date(), 24),
});

export const genResetPasswordToken = async () => ({
  resetPasswordToken: await genToken(32, 'hex'),
  resetPasswordTokenExpiry: addHours(new Date(), 24),
});

export const genResetWalletPasswordToken = async () => ({
  resetWalletPasswordToken: await genToken(32, 'hex'),
  resetWalletPasswordTokenExpiry: addHours(new Date(), 24),
});

export const checkForCorrectPassword = async (candidatePassword, username, wallet = false) => {
  const user = await findUserPassword({
    username,
  });
  if (user == null) throw new Error('User not found!');
  if (wallet) {
    return comparePasswordToHash(candidatePassword, user.walletPassword);
  }
  return comparePasswordToHash(candidatePassword, user.password);
};

export const signJWT = (userToBeSigned, expirationPeriod) => {
  let expiresIn = expirationPeriod;
  const user = userToBeSigned;

  return new Promise((resolve, reject) => {
    if (!expiresIn) {
      expiresIn = '1d';
    } else {
      expiresIn = '7d';
    }
    // HOTFIX: For big merchants, size of encoded jwt can grow so much that we aren't able to jam it in the http header anymore
    delete user.deviceTokens;

    user.listedProducts = [];
    jwt.sign(
      {
        user,
      },
      Env.SECRET,
      {
        expiresIn,
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      },
    );
  });
};


