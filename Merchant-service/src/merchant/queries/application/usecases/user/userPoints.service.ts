import Env from '../../../../../Env';

import * as userRepositoryInstance from '../../../infrastructure/repositories/userPoints.repository';

const getUserTotalPoints = async id => {
  const userPoints = await userRepositoryInstance.findUserPointsByUserId(id);
  return userPoints.map(x => x.pointsCount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

function getNextPoints(totalPoints) {
  let nextPoints = 0;
  if (totalPoints >= Env.GOLD) {
    nextPoints = Env.PLATINUM - totalPoints;
  } else if (totalPoints >= Env.SILVER) {
    nextPoints = Env.GOLD - totalPoints;
  } else if (totalPoints < Env.SILVER) {
    nextPoints = Env.SILVER - totalPoints;
  }

  return nextPoints;
}

export const getUserLoyaltyProgram = async user => {
  const totalPoints = await getUserTotalPoints(user._id);

  const nextPoints = getNextPoints(totalPoints);

  return {
    loyaltyProgram: user.loyaltyProgram && user.loyaltyProgram != '' ? user.loyaltyProgram : 'BLUE',
    points: totalPoints,
    nextPoints,
  };
};


