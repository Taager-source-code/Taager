import { Service } from 'typedi';
import UserFeaturesSchema from '../../../../merchant/common/infrastructure/db/schemas/userFeatures.model';

@Service({ global: true })
export default class UserFeaturesDao {
  async isFeatureEnabled(featureName: string, taagerId: string): Promise<boolean> {
    const feature = await UserFeaturesSchema.findOne({
      tagerIds: {
        $regex: `^${taagerId} ?,|, ?${taagerId}$|, ?${taagerId} ?,|^ ?${taagerId} *$`, // i know; quite terrible but I don't wanna refactor this TBH
      },
      feature: featureName,
    });

    return !!feature;
  }

  async enableFeature(featureName: string, taagerId: string): Promise<void> {
    return UserFeaturesSchema.updateOne({ feature: featureName }, [
      { $set: { tagerIds: { $concat: ['$tagerIds', `,${taagerId}`] } } },
    ]).exec();
  }
}


