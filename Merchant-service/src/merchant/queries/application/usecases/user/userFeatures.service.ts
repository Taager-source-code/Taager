import * as userFeaturesRepository from '../../../infrastructure/repositories/userFeatures.repository';

export const getUserFeaturesByTaagerID = async TaagerID => {
  const features = await userFeaturesRepository.findUserFeaturesByTagerID(TaagerID);
  return features.map(feature => feature.feature);
};


