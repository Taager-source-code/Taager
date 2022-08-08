import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import UserPointsModel from '../../../common/infrastructure/db/schemas/userPoints.model';

const mongooseServiceInstance = new MongooseService(UserPointsModel);

export async function findUserPointsByUserId(userId) {
  try {
    return await mongooseServiceInstance.findAll({
      userId,
      status: 'active',
    });
  } catch (err) {
    return err;
  }
}


