import joi from 'joi';

import { UNPROCESSABLE_ENTITY, OK, CREATED, CONFLICT } from 'http-status';

import FormData from 'form-data';

import axios, { AxiosRequestConfig } from 'axios';
import videoUpload from '../../../../shared-kernel/infrastructure/services/file-upload';

import { findMyOrder, findOrderByIdAndUpdate } from '../../../queries/application/usecases/order.service';
import { addOrderIssue, findAllOrderIssues } from '../../application/usecases/orderIssues.service';

import { findUserWallet } from '../../../../merchant/commands/application/usecases/userWallet.service';

import { createOrderActivity } from '../../application/usecases/orderActivity.service';

import { cancelOrderIssue } from '../../application/usecases/cancelOrderIssues.service';
import Env from '../../../../Env';
import { Container } from 'typedi';
import CountryRepo from '../../../../shared-kernel/infrastructure/repositories/CountryRepo';

const singleUpload = videoUpload.single('image');

export const addImage = async (req, res) => {
  const data = new FormData();
  data.append('file', `@${req.body.image}`);
  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.scanii.com/v2.1/files',
    headers: {
      Authorization: Env.SCANII_API_KEY,
    },
    data,
  };

  axios(config)
    .then(response => {
      if (response.data.findings.length == 0) {
        singleUpload(req, res, function(err) {
          if (!err && req.file) {
            return res.status(OK).json({
              msg: req.file.location,
            });
          }
          console.log(err);
          return res.status(UNPROCESSABLE_ENTITY).json({
            msg: 'Un-able to process image, Please try again later',
          });
        });
      }
    })
    .catch(error => {
      if (error.response.status == 415) {
        singleUpload(req, res, function(err) {
          if (!err && req.file) {
            return res.status(OK).json({
              msg: req.file.location,
            });
          }
          console.log(err);
          return res.status(UNPROCESSABLE_ENTITY).json({
            msg: 'Un-able to process image, Please try again later',
          });
        });
      }
    });
};

export const addOrderRefund = async (req, res) => {
  const schema = joi.object({
    issueType: joi.number().required(),
    order: joi.object().required(),
    product: joi.object().required(),
    phoneNum: joi.string().allow(null, ''),
    issueReason: joi.number().required(),
    notes: joi.string().allow(null, ''),
    issueImage: joi.string().allow(null, ''),
    issueVideo: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  Object.assign(body, {
    user: {
      userObjectId: req.decodedToken.user._id,
      TagerId: req.decodedToken.user.TagerID,
    },
  });
  // get the order from the database, to get the country of the order
  const order = await findMyOrder(body.order.OrderId, req.decodedToken.user.TagerID);
  if (!order) {
    return res.status(CONFLICT).json({
      msg: `order not found!`,
    });
  }
  const country = await Container.of()
    .get(CountryRepo)
    .getByIsoCode(order.country);
  if (!country)
    return res.status(CONFLICT).json({
      msg: `something went wrong! shouldn't happen though`,
    });

  const options = {
    userID: req.decodedToken.user._id,
    currency: country.currencyIsoCode,
  };
  const UserWallet = await findUserWallet(options);
  if (UserWallet) {
    const eligibleProfit = UserWallet[0].eligibleProfit ? UserWallet[0].eligibleProfit : 0;
    if (body.product.productProfit <= eligibleProfit) {
      body.country = order.country;
      const newIssue = await addOrderIssue(body);
      if (newIssue) {
        const createActivityObj: any = {
          orderStatus: 'order_refund_request',
          orderObjectId: body.order.orderObjectId,
          orderID: body.order.OrderId,
        };
        if (req.body.notes) {
          createActivityObj.notes = req.body.notes;
        }

        await createOrderActivity(createActivityObj);

        await findOrderByIdAndUpdate({
          id: body.order.orderObjectId,
          update: {
            $set: {
              hasIssue: true,
            },
          },
          options: {
            new: false,
          },
          lean: false,
        });
        return res.status(CREATED).json({
          msg: 'OrderIssue added!',
        });
      }
      return res.status(UNPROCESSABLE_ENTITY).json({
        msg: error.details[0].message,
      });
    }
  }
  return res.status(UNPROCESSABLE_ENTITY).json({
    msg: 'eligibleProfit is Less than Payment Request AMOUNT',
  });
};

export const addOrderReplacement = async (req, res) => {
  const schema = joi.object({
    issueType: joi.number().required(),
    order: joi.object().required(),
    product: joi.object().required(),
    sameProductReplacement: joi.boolean().required(),
    issueReason: joi.number().required(),
    notes: joi.string().allow(null, ''),
    issueImage: joi.string().allow(null, ''),
    issueVideo: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  Object.assign(body, {
    user: {
      userObjectId: req.decodedToken.user._id,
      TagerId: req.decodedToken.user.TagerID,
    },
  });
  const order = await findMyOrder(body.order.OrderId, req.decodedToken.user.TagerID);
  if (!order) {
    return res.status(CONFLICT).json({
      msg: `order not found!`,
    });
  }
  body.country = order.country;
  const newIssue = await addOrderIssue(body);
  if (newIssue) {
    await findOrderByIdAndUpdate({
      id: body.order.orderObjectId,
      update: {
        $set: {
          hasIssue: true,
        },
      },
      options: {
        new: false,
      },
      lean: false,
    });
    const createActivityObj: any = {
      orderStatus: 'order_replacement_request',
      orderObjectId: body.order.orderObjectId,
      orderID: body.order.OrderId,
    };
    console.log(createActivityObj);
    if (req.body.notes) {
      createActivityObj.notes = req.body.notes;
    }

    await createOrderActivity(createActivityObj);

    return res.status(CREATED).json({
      msg: 'OrderIssue added!',
    });
  }
  return res.status(UNPROCESSABLE_ENTITY).json({
    msg: error.details[0].message,
  });
};

export const addOrderCompletion = async (req, res) => {
  const schema = joi.object({
    issueType: joi.number().required(),
    order: joi.object().required(),
    product: joi.object().required(),
    notes: joi.string().allow(null, ''),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  Object.assign(body, {
    user: {
      userObjectId: req.decodedToken.user._id,
      TagerId: req.decodedToken.user.TagerID,
    },
  });
  const order = await findMyOrder(body.order.OrderId, req.decodedToken.user.TagerID);
  if (!order) {
    return res.status(CONFLICT).json({
      msg: `order not found!`,
    });
  }
  body.country = order.country;
  const newIssue = await addOrderIssue(body);
  if (newIssue) {
    await findOrderByIdAndUpdate({
      id: body.order.orderObjectId,
      update: {
        $set: {
          hasIssue: true,
        },
      },
      options: {
        new: false,
      },
      lean: false,
    });

    const createActivityObj: any = {
      orderStatus: 'order_addition_request',
      orderObjectId: body.order.orderObjectId,
      orderID: body.order.OrderId,
    };
    if (req.body.notes) {
      createActivityObj.notes = req.body.notes;
    }

    await createOrderActivity(createActivityObj);

    return res.status(CREATED).json({
      msg: 'OrderIssue added!',
    });
  }
  return res.status(UNPROCESSABLE_ENTITY).json({
    msg: error.details[0].message,
  });
};

export const getOrderIssue = async (req, res) => {
  const options = {
    'order.orderObjectId': req.body.orderId,
  };
  const Issues = await findAllOrderIssues(options);

  return res.status(OK).json({
    msg: 'Issue found!',
    data: Issues,
  });
};

export const cancelOrderDueToIssue = async (req, res) => {
  const schema = joi.object({
    status: joi.string().required(),
    objectId: joi.string().required(),
    orderObjectId: joi.string().required(),
    orderId: joi.string().required(),
    issueType: joi.number().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }

  await cancelOrderIssue(body);

  return res.status(OK).json({
    msg: 'Issue Cancelled',
  });
};


