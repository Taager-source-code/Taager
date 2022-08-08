import UserPoints from '../../../common/infrastructure/db/schemas/userPoints.model';

export const findUserPointsByuserIdAndDateNumber = (userId, dateNumber) =>
  UserPoints.find({ userId, dateNumber, status: 'active' });

export const findUserPointsByuserId = userId => UserPoints.find({ userId, status: 'active' });

export const findAllActiveUserPoints = () => UserPoints.find({ status: 'active' });

export const findUserPointsByIdAndUpdate = ({ id, update, options, lean = true }) =>
  UserPoints.findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();

export const deleteAll = () => UserPoints.deleteMany({});


