import joi from 'joi';
import { NOT_FOUND, UNPROCESSABLE_ENTITY, OK, CREATED, UNAUTHORIZED, FORBIDDEN } from 'http-status';
import { findUserById } from '../../../queries/application/usecases/user.service';
import {
  findTagerIdsbyFeature,
  findUserFeaturesById,
  createUserFeatures,
  findAndDeleteUserFeatures,
  findUserFeaturesByIdAndUpdate,
  findAllUserFeatures,
} from '../../application/usecases/userFeatures.service';

export const addUserFeatures = async (req, res) => {
  const schema = joi.object({
    feature: joi.string().required(),
    tagerIds: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  await createUserFeatures(body);
  return res.status(CREATED).json({
    msg: 'User Features added!',
  });
};

export const deleteUserFeatures = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(NOT_FOUND).json({
        msg: 'User Features not found',
      });
    }

    const UserFeatures = await findUserFeaturesById(req.params.id);

    if (!UserFeatures) {
      return res.status(NOT_FOUND).json({
        msg: "This User Features doesn't exist anymore",
      });
    }
    /* 
    const orders = await findActiveOrdersByReceiverName(UserFeatures.ReceiverName);

    if(orders && orders.length>0){
      return res.status(UNPROCESSABLE_ENTITY).json({
        msg: "This User Features has active order, and so can't be deleted",
      });
    } */

    const user = await findUserById(req.decodedToken.user._id);

    if (user.userLevel === 3) {
      await findAndDeleteUserFeatures(UserFeatures._id);
      return res.status(OK).json({
        msg: 'User Features deleted!',
      });
    }
    return res.status(FORBIDDEN).json({
      msg: 'You are not Authorized to delete this User Features',
    });
  } catch (e) {
    return res.status(UNPROCESSABLE_ENTITY).json(e);
  }
};

export const updateUserFeatures = async (req, res) => {
  if (req.decodedToken.user.userLevel != 3) {
    return res.status(UNAUTHORIZED).json({
      msg: 'Un-authorized action',
    });
  }
  const schema = joi.object({
    feature: joi.string().required(),
    tagerIds: joi.string().required(),
  });
  const { error, value: body } = schema.validate(req.body);
  if (error) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: error.details[0].message,
    });
  }
  let UserFeatures = await findUserFeaturesById(req.params.id);

  if (!UserFeatures) {
    return res.status(NOT_FOUND).json({
      msg: 'Un-able to find required resource',
    });
  }
  UserFeatures = await findUserFeaturesByIdAndUpdate({
    id: UserFeatures._id,
    update: {
      $set: {
        feature: body.feature,
        tagerIds: body.tagerIds,
      },
    },
    options: {
      new: false,
    },
    lean: false,
  });
  if (!UserFeatures) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: 'Failed to update User Features',
    });
  }
  return res.status(OK).json({
    msg: 'User Features updated successfully',
    data: UserFeatures,
  });
};

export const viewAllUserFeatures = async (req, res) => {
  const UserFeatures = await findAllUserFeatures();
  if (UserFeatures) {
    return res.status(OK).json({
      msg: 'User Features list found!',
      data: UserFeatures,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: "User Features can't be retrieved",
  });
};

export const getTagerIdsbyFeature = async (req, res) => {
  const UserFeatures = await findTagerIdsbyFeature(req.params.feature);
  if (UserFeatures) {
    return res.status(OK).json({
      msg: 'User Features list found!',
      data: UserFeatures,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: "User Features can't be retrieved",
  });
};


