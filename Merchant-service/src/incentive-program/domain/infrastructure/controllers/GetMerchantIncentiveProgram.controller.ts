import { OK, SERVICE_UNAVAILABLE, NOT_FOUND } from 'http-status';
import IncentiveProgramRepositoryImp from '../repositories/IncentiveProgramRepositoryImp';
import GetMerchantIncentiveProgramService from '../../application/get-merchant-Incetive-program/GetMerchantIncentiveProgramService';
import MerchantNotEligibleForIncentiveProgram from './../../application/get-merchant-Incetive-program/Exceptions';

/**
 *
 * @param {GetMIPResponse} getMIPResponse
 * @returns {{}}
 */
function mapToHttpResponse(getMIPResponse) {
  return {
    target: getMIPResponse.incentiveProgram.programTarget,
    currentOrders: getMIPResponse.orders,
    incentiveProgramType: getMIPResponse.incentiveProgram.incentiveProgramType,
    currentReward: getMIPResponse.incentiveProgram.getCurrentReward(getMIPResponse.orders),
    milestones: getMIPResponse.incentiveProgram.milestones.map(milestone => {
      return {
        target: milestone.getTarget(),
        reward: milestone.milestoneReward,
      };
    }),
  };
}

function handleSuccess(res, getMIPResponse) {
  res.status(OK).json({
    msg: 'success',
    data: mapToHttpResponse(getMIPResponse),
  });
}

function handleError(res, err) {
  if (err instanceof MerchantNotEligibleForIncentiveProgram) {
    res.status(NOT_FOUND).json({
      msg: 'Merchant Not Eligible For Incentive Program',
    });
  } else {
    res.status(SERVICE_UNAVAILABLE).json({
      msg: err.stack,
    });
  }
}

export const execute = async (req, res) => {
  const tagerId = req.decodedToken.user.TagerID;

  const incentiveProgramRepository = new IncentiveProgramRepositoryImp();
  const getMerchantIncentiveProgramService = new GetMerchantIncentiveProgramService(incentiveProgramRepository);

  getMerchantIncentiveProgramService
    .execute(tagerId)
    .then(result => handleSuccess(res, result))
    .catch(err => handleError(res, err));
};


