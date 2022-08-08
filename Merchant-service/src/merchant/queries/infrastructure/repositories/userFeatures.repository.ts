import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';
import UserFeaturesModel from '../../../common/infrastructure/db/schemas/userFeatures.model';
import { isEmptyObject } from '../../../../authentication/commands/infrastructure/utils/validations';

const userFeaturesCollection = new MongooseService(UserFeaturesModel);

export async function findUserFeaturesByTagerID(TagerID) {
  try {
    return await userFeaturesCollection.findAll({
      tagerIds: {
        $regex: `^${TagerID} ?,|, ?${TagerID}$|, ?${TagerID} ?,|^ ?${TagerID} *$`,
      },
    });
  } catch (err) {
    return err;
  }
}

/**
 * @param tagerId
 * @param feature
 * @returns {Promise<boolean>}
 */
export async function isFeatureAllowed(tagerId, feature) {
  try {
    const doc = await userFeaturesCollection.findOne({
      tagerIds: {
        $regex: `^${tagerId} ?,|, ?${tagerId}$|, ?${tagerId} ?,|^ ?${tagerId} *$`,
      },
      feature,
    });
    return !isEmptyObject(doc);
  } catch (err) {
    Logger.error(`isFeatureAllowed: ${(err as Error).stack}`);
    return false;
  }
}


