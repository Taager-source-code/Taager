import UserFeatures from '../../../common/infrastructure/db/schemas/userFeatures.model';

export const findAllUserFeatures = () => UserFeatures.find().exec();

export const createUserFeatures = body => UserFeatures.create(body);

export const findUserFeaturesByIdAndUpdate = ({ id, update, options, lean = true }) =>
  UserFeatures.findByIdAndUpdate(id, update, options)
    .lean(lean)
    .exec();

export const findUserFeaturesById = id => UserFeatures.findById(id).exec();

export const countUserFeatures = query => UserFeatures.countDocuments(query).exec();

export const findTagerIdsbyFeature = feature => UserFeatures.find({ feature }).exec();

export const findAndDeleteUserFeatures = id => UserFeatures.findByIdAndDelete(id);


