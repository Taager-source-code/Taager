import { NOT_FOUND, UNPROCESSABLE_ENTITY, OK } from 'http-status';

import * as userPointsService from '../../application/usecases/userPoints.service';

export const expireUserPoints = async (req, res) => {
  const userPointsUpdated = await userPointsService.findUserPointsByIdAndUpdate({
    id: req.body.id,
    update: {
      $set: {
        status: 'expired',
      },
    },
    options: {
      new: false,
    },
    lean: false,
  });
  if (!userPointsUpdated) {
    console.log(userPointsUpdated);
    return res.status(UNPROCESSABLE_ENTITY).json({
      msg: `Failed to expire user points for ${req.id}`,
    });
  }
  return res.status(OK).json({
    msg: 'User points updated successfully',
    data: userPointsUpdated,
  });
};

export const findAllActiveUserPoints = async (req, res) => {
  const userPoints = await userPointsService.findAllActiveUserPoints();
  if (userPoints) {
    return res.status(OK).json({
      msg: 'User Points list found!',
      data: userPoints,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: "User Points can't be retrieved",
  });
};

export const findUserPointsByUserId = async (req, res) => {
  if (!req.params.id) {
    return res.status(NOT_FOUND).json({
      msg: 'No user points',
    });
  }
  const userPoints = await userPointsService.findUserPointsByuserId(req.params.id);
  if (userPoints) {
    return res.status(OK).json({
      msg: 'User Points list found!',
      data: userPoints,
    });
  }
  return res.status(NOT_FOUND).json({
    msg: "User Points can't be retrieved",
  });
};


