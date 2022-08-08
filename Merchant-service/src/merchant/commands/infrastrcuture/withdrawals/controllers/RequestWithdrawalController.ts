import { Service } from 'typedi';
import RequestWithdrawal from '../../../application/withdrawals/usecases/RequestWithdrawal';
import {
  InsufficientEligibleAmountError,
  WalletNotFoundError,
  WithdrawalRequestFeatureDisabled,
} from '../../../application/withdrawals/exceptions/WithdrawalsExceptions';
import { CREATED, UNPROCESSABLE_ENTITY, CONFLICT, SERVICE_UNAVAILABLE } from 'http-status';
import { InvalidWithdrawalAmountError } from '../../../domain/withdrawals/exceptions/WithdrawalsExceptions';
import joi from 'joi';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import {
  isRamadanBlockEnabled,
  isWithdrawalRequestBlockDatesActivated,
} from '../../../../../shared-kernel/infrastructure/toggles/activeFeatureToggles';

@Service({ global: true })
export default class RequestWithdrawalController extends HttpProcessor {
  private requestWithdrawal: RequestWithdrawal;

  constructor(requestWithdrawal: RequestWithdrawal) {
    super();
    this.requestWithdrawal = requestWithdrawal;
  }

  schema = joi.object({
    currency: joi.string().required(),
    amount: joi.number().required(),
    paymentMethod: joi.string().required(),
    phoneNum: joi.string().required(),
  });

  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    try {
      this.checkWithdrawalFeatureAvailability(req.decodedToken.user.TagerID);
      await this.requestWithdrawal.execute({
        userId: req.decodedToken.user._id,
        amount: joiValue.amount,
        paymentMethod: joiValue.paymentMethod,
        phoneNum: joiValue.phoneNum,
        currency: joiValue.currency,
        taagerId: req.decodedToken.user.TagerID,
      });
      return { status: CREATED, data: {} };
    } catch (err) {
      if (err instanceof InsufficientEligibleAmountError)
        return {
          status: CONFLICT,
          errorCode: 'withdrawals-0001',
          description: 'Insufficient eligible profit',
          message: `Insufficient eligible profit to withdraw`,
        };
      if (err instanceof InvalidWithdrawalAmountError)
        return {
          status: UNPROCESSABLE_ENTITY,
          errorCode: 'withdrawals-0002',
          description: 'Invalid withdrawal amount ' + joiValue.amount,
          message: `Invalid withdrawal's amount, try diff amount`,
        };
      if (err instanceof WalletNotFoundError)
        return {
          status: CONFLICT,
          errorCode: 'withdrawals-0003',
          description: `User wallet not found!`,
          message: `Something went wrong, please contact support`,
        };
      if (err instanceof WithdrawalRequestFeatureDisabled)
        return {
          status: SERVICE_UNAVAILABLE,
          errorCode: 'withdrawals-0004',
          description: `Withdrawal Requests disabled`,
          message: `Something went wrong, please contact support`,
        };
      else throw err;
    }
  }
  private checkWithdrawalFeatureAvailability(tagerId: string) {
    if (isRamadanBlockEnabled(tagerId) && isWithdrawalRequestBlockDatesActivated()) {
      throw new WithdrawalRequestFeatureDisabled();
    }
  }
}


