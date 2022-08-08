import joi from 'joi';

import { findUserById } from '../../../queries/application/usecases/user.service';
import * as paymentRequestService from '../../application/usecases/paymentRequest.service';
import { v4 as Uuid } from 'uuid';
import { findUserWallet, findUserWalletByIdAndUpdate } from '../../application/usecases/userWallet.service';
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from 'http-status';
import { Container } from 'typedi';
import { TransactionManager } from '../../../../shared-kernel/infrastructure/transactions/TransactionManager';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';

const container = Container.of();

export const viewMyPaymentRequest = async (req, res) => {
  const page = +(req.query.page - 1);
  const pageSize = +req.query.pageSize;
  const options = {
    userId: req.decodedToken.user._id,
    currency: 'EGP',
    paymentWay: {
      $in: ['vodafone_cash', 'orange_cash', 'we_pay', 'etisalat_cash', 'bank_transfer'],
    },
    amount: { $gt: 0 },
  };
  const requests = await paymentRequestService.getAllRequests(options, page, pageSize);
  const counted = await paymentRequestService.countRequests(options);
  const endflag = Math.ceil(counted / pageSize) === req.query.page;
  if (requests) {
    return res.status(OK).json({
      msg: 'Requests list found!',
      data: requests,
      endPages: endflag,
      count: counted,
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "Requests can't be retrieved",
  });
};

export const getPaymentRequestsByUser = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const user = await findUserById(req.decodedToken.user._id);
  if (user.userLevel !== 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const options = {
    userId: {
      $in: req.body.userIdsArray,
    },
    status: { $ne: 'rejected' },
  };
  const requests = await paymentRequestService.findPaymentRequests(options);
  if (requests) {
    return res.status(OK).json({
      msg: 'Requests list found!',
      data: requests,
    });
  }

  return res.status(NOT_FOUND).json({
    msg: "Requests can't be retrieved",
  });
};

export const addPaymentRequest = async (req, res) => {
  const schema = joi.object({
    amount: joi.number().required(),
    paymentWay: joi.string().required(),
    phoneNum: joi.string().required(),
    userId: joi
      .string()
      .required()
      .allow(''),
    status: joi
      .string()
      .required()
      .allow(''),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  const currency = 'EGP';
  if (!body.status) body.status = 'received';
  if (!body.userId) body.userId = req.decodedToken.user._id;
  const options = {
    userID: req.decodedToken.user._id,
    currency: currency,
  };
  const transactionManager = container.get(TransactionManager);
  await transactionManager.runTransactionally(async session => {
    const UserWallets = await findUserWallet(options, session);
    if (UserWallets != null && UserWallets[0]) {
      const eligibleProfit = UserWallets[0].eligibleProfit != null ? UserWallets[0].eligibleProfit : 0;

      if (body.amount <= eligibleProfit && body.amount > 0) {
        body.currency = currency;
        body.withdrawalId = Uuid();
        body.taagerId = req.decodedToken.user.TagerID;
        await paymentRequestService.addPaymentRequest(body, session);

        Logger.info(
          `Action: add_payment_request, By: ${req.decodedToken.user._id}, amount: ${
            body.amount
          }, currency: ${currency}, 
            wallet: ${UserWallets} `,
          { domain: `wallet`, userId: body.userId },
        );
        await findUserWalletByIdAndUpdate({
          id: UserWallets[0]._id,
          update: {
            $set: {
              eligibleProfit: eligibleProfit - body.amount,
            },
          },
          options: {
            new: false,
            session,
          },
          lean: false,
        });
        return res.status(CREATED).json({
          msg: 'Payment Request added!',
        });
      }
      return res.status(UNPROCESSABLE_ENTITY).json({
        msg: 'eligibleProfit is Less than Payment Request AMOUNT',
      });
    }
  });
  return res.status(UNPROCESSABLE_ENTITY).json({
    msg: 'User Wallet cant be retreived',
  });
};


