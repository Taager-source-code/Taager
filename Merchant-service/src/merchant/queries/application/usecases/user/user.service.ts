import * as userRepository from '../../../infrastructure/repositories/user.repository';
import { getUserLoyaltyProgram } from './userPoints.service';
import { getUserFeaturesByTaagerID } from './userFeatures.service';

export const findUserProfileById = async id => userRepository.findUserById(id);

export const getUserFeaturesAndLoyalty = async user => {
  const loyaltyProgram = await getUserLoyaltyProgram(user);

  const features = await getUserFeaturesByTaagerID(user.TagerID);

  return { ...user, loyaltyProgram, features };
};


