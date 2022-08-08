import joi from 'joi';
import { NOT_FOUND, UNPROCESSABLE_ENTITY, OK, CREATED } from 'http-status';
import * as userWalletService from '../../application/usecases/userWallet.service';

export const viewMyWallet = async (req, res) => {
  const options = {
    userID: req.decodedToken.user._id,
    currency: 'EGP',
  };
  const UserWallet = await userWalletService.findUserWallet(options);
  if (UserWallet) {
    return res.status(OK).json({
      msg: 'UserWallet found!',
      data: UserWallet,
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "UserWallet can't be retrieved",
  });
};
export const updateWalletByUserId = async (req, res) => {
  const schema = joi.object({
    userID: joi
      .string()
      .required()
      .allow(''),
    eligibleProfit: joi.number().required(),
    deliveredOrders: joi.number().required(),
    inprogressProfit: joi.number().required(),
    inprogressOrders: joi.number().required(),
    currency: joi.string().default('EGP'),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  let userWallet: any;

  let currencyQuery: any;

  if (body.currency === 'EGP') {
    currencyQuery = {
      $or: [{ currency: { $exists: false } }, { currency: body.currency }],
    };
  } else {
    currencyQuery = { currency: body.currency };
  }

  const wallets = await userWalletService.findUserWallet({
    $and: [{ userID: req.body.userID }, currencyQuery],
  });
  if (wallets[0]) {
    userWallet = await userWalletService.findUserWalletByIdAndUpdate({
      id: wallets[0]._id,
      update: {
        $set: {
          eligibleProfit: body.eligibleProfit,
          deliveredOrders: body.deliveredOrders,
          inprogressProfit: body.inprogressProfit,
          inprogressOrders: body.inprogressOrders,
        },
      },
      options: {
        new: false,
      },
      lean: false,
    });
    if (!userWallet) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        msg: 'Failed to update UserWallet',
      });
    }
  } else {
    const newWallet = await userWalletService.addUserWallet(body);
    if (!newWallet) {
      return res.status(CREATED).json({
        msg: 'Failed to add UserWallet',
      });
    }
  }

  return res.status(OK).json({
    msg: 'UserWallet updated successfully',
    data: wallets,
  });
};


