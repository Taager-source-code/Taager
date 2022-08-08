import joi from 'joi';
import fs from 'fs-extra';
import path from 'path';
import { NOT_FOUND, CONFLICT, UNPROCESSABLE_ENTITY, OK } from 'http-status';
import {
  findUser,
  findUserByIdAndUpdate,
  findUserById,
  findAllUsers,
} from '../../../queries/application/usecases/user.service';
import { findUserProfileById } from '../../../queries/application/usecases/user/user.service';
import { findAllOrders } from '../../../../order-management/queries/application/usecases/order.service';
import { findProductById } from '../../../../content-management/commands/application/usecases/product.service';
import { encryptPassword } from '../../../../authentication/commands/application/usecases/auth.service';
import { findUserPointsByuserId } from '../../application/usecases/userPoints.service';
import {
  getUserCartProductsDetails,
  removeProductFromUserCart,
} from '../../../../order-management/commands/application/usecases/cart.service';
import { getUserFeaturesAndLoyalty } from '../../../queries/application/usecases/user/user.service';
import Env from '../../../../Env';

export const updateProfile = async (req, res) => {
  const schema = joi
    .object({
      firstName: joi.string().trim(),
      lastName: joi.string().trim(),
      phoneNum: joi.string().trim(),
      email: joi
        .string()
        .trim()
        .lowercase()
        .email()
        .optional(),
      profilePicture: joi
        .string()
        .trim()
        .optional(),
      password: joi.string().optional(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  const { phoneNum, email } = body;
  if (phoneNum || email) {
    const user = await findUser({
      _id: {
        $ne: req.decodedToken.user._id,
      },
      $or: [
        {
          phoneNum,
        },
        {
          email,
        },
      ],
    });
    if (user) {
      return res.status(CONFLICT).json({
        msg: 'PhoneNum or Email already exists, please choose another.',
      });
    }
  }
  if (req.body.password != null) {
    body.password = await encryptPassword(body.password.toString());
  } else {
    delete body.password;
  }
  body.updatedAt = new Date();
  const updatedUser = await findUserByIdAndUpdate({
    id: req.decodedToken.user._id,
    update: {
      $set: body,
    },
    options: {
      new: true,
    },
    lean: true,
  });
  if (!updatedUser) {
    return res.status(NOT_FOUND).json({
      msg: 'Account not found.',
    });
  }
  const updatedUserWithLoyalty = await getUserFeaturesAndLoyalty(updatedUser);

  res.status(OK).json({
    msg: 'Profile was updated successfully.',
    data: updatedUserWithLoyalty,
  });
};

export const updateProfileDeviceTokens = async (req, res) => {
  const schema = joi
    .object({
      deviceToken: joi.string().required(),
    })
    .options({
      stripUnknown: true,
    });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  const { deviceToken } = body;
  const user = await findUserById(req.decodedToken.user._id);
  if (!user) {
    return res.status(NOT_FOUND).json({
      msg: 'User not found.',
    });
  }
  const updatedUser = await findUserByIdAndUpdate({
    id: req.decodedToken.user._id,
    update: { $addToSet: { deviceTokens: deviceToken } },
    options: {
      new: true,
    },
    lean: false,
  });
  if (!updatedUser) {
    return res.status(NOT_FOUND).json({
      msg: 'Account not found.',
    });
  }
  res.status(OK).json({
    msg: 'Profile was updated successfully.',
    data: updatedUser,
  });
};

export const setFreshChatRestoreId = async (req, res) => {
  const updatedUser = await findUserByIdAndUpdate({
    id: req.decodedToken.user._id,
    update: {
      $set: { fcRestoreId: req.body.fcRestoreId },
    },
    options: {
      new: true,
    },
    lean: false,
  });
  if (!updatedUser) {
    return res.status(NOT_FOUND).json({
      msg: 'Account not found.',
    });
  }
  res.status(OK).json({
    msg: 'Profile was updated successfully.',
    data: updatedUser,
  });
};

export const changeProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: 'Image upload has encountered an error, supported image types are: png, jpeg, gif.',
    });
  }
  const body = {
    profilePicture: `${Env.MEDIA_FOLDER}/${req.decodedToken.user.username}/profilePictures/${req.file.filename}`,
  };
  const user = await findUserByIdAndUpdate({
    id: req.decodedToken.user._id,
    update: {
      $set: body,
    },
  });
  if (!user) {
    return res.status(NOT_FOUND).json({
      msg: 'Account not found.',
    });
  }
  if (user.profilePicture) {
    await fs.remove(path.resolve('./', user.profilePicture));
  }
  res.status(OK).json({
    msg: 'Profile Picture was changed successfully.',
    data: body.profilePicture,
  });
};

export const viewOwnProfile = async (req, res) => {
  if (req.decodedToken) {
    const user = await findUserProfileById(req.decodedToken.user._id);
    if (user) {
      return res.status(OK).json({
        data: user,
      });
    }
    return res.status(NOT_FOUND).json({
      msg: 'User not found!',
    });
  }
};

export const removeFromCart = async (req, res) => {
  const prod = await findProductById(req.params.pid);
  if (!prod || prod.country != req.country.countryIsoCode3) {
    return res.status(NOT_FOUND).json({
      msg: "Looks like this product doesn't exist anymore!",
    });
  }

  await removeProductFromUserCart(req.decodedToken.user._id, req.country.countryIsoCode3, prod._id);

  return res.status(OK).json({
    msg: 'Product removed from your cart',
  });
};

export const getCart = async (req, res) => {
  if (req.decodedToken) {
    const user = await findUserById(req.decodedToken.user._id);
    if (user) {
      const products = await getUserCartProductsDetails(req.decodedToken.user._id, req.country.countryIsoCode3);

      return res.status(OK).json({
        data: products,
      });
    }
    return res.status(NOT_FOUND).json({
      msg: 'User not found!',
    });
  }
};
export const getUserLevel = async (req, res) => {
  const user = await findUserById(req.decodedToken.user._id);
  if (user) {
    return res.status(OK).json({
      data: user.userLevel,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: 'Not found!',
  });
};

export const getUserByTaagerId = async (req, res) => {
  const user = await findUser({
    TagerID: req.params.id,
  });
  if (!user) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: 'Not Found',
    });
  }
  res.status(OK).json({
    msg: 'User found successfully',
    data: user,
  });
};

export const updateLoyaltyProgram = async (req, res) => {
  const userUpdated = await findUserByIdAndUpdate({
    id: req.body.userId,
    options: {
      new: false,
    },
    lean: true,
    update: {
      $set: {
        loyaltyProgram: req.body.loyaltyProgram,
      },
    },
  });
  if (userUpdated) {
    return res.status(OK).json({
      msg: 'Loyalty Program updated',
    });
  }
  return res.status(UNPROCESSABLE_ENTITY).json({
    msg: 'Failed to update Loyalty Program',
  });
};

export const getUserLoyaltyProgram = async (req, res) => {
  const user = await findUserById(req.decodedToken.user._id);
  if (user == null) throw new Error('User is not found');
  let nextPoints = 0;
  const userPoints = await findUserPointsByuserId(req.decodedToken.user._id);
  const sum = userPoints.map(x => x.pointsCount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  if (sum >= Env.GOLD) {
    nextPoints = Env.PLATINUM - sum;
  } else if (sum >= Env.SILVER) {
    nextPoints = Env.GOLD - sum;
  } else if (sum < Env.SILVER) {
    nextPoints = Env.SILVER - sum;
  }

  const loyaltyProgram = {
    loyaltyProgram: user.loyaltyProgram && user.loyaltyProgram != '' ? user.loyaltyProgram : 'BLUE',
    points: sum,
    nextPoints,
  };

  return res.status(OK).json({
    msg: 'Loyalty Program',
    data: loyaltyProgram,
  });
};

export const getAllActiveUsers = async (req, res) => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 60);

  const QueryUpdateOrder = { createdAt: { $gte: expiredDate } };

  const orders = await findAllOrders(QueryUpdateOrder, 0, 100000);

  console.log(orders.length);

  const ids: any[] = [];
  for (let index = 0; index < orders.length; index += 1) {
    const element = orders[index];

    if (!ids.find(x => String(x) == String(element.orderedBy))) ids.push(element.orderedBy);
  }

  console.log(ids.length);

  const users = await findAllUsers({ _id: { $in: ids } }, 0, 100000);

  return res.status(OK).json({
    msg: 'Active users',
    data: users,
  });
};


