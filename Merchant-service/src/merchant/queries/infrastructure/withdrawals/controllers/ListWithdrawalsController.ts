import { Service } from 'typedi';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import ListWithdrawals from '../../../application/withdrawals/usecases/ListWithdrawals';
import WithdrawalQuery from '../../../application/withdrawals/models/WithdrawalQuery';
import joi, { Schema } from 'joi';
import { OK } from 'http-status';

@Service({ global: true })
export class ListWithdrawalsController extends HttpProcessor {
  private listWithdrawal: ListWithdrawals;

  constructor(listWithdrawal: ListWithdrawals) {
    super();
    this.listWithdrawal = listWithdrawal;
  }

  async execute(req): Promise<HttpSuccess | HttpError> {
    const query: WithdrawalQuery = {
      page: +(req.body.page - 1),
      pageSize: +req.body.pageSize,
      userId: req.decodedToken.user._id,
      status: req.body.status,
      currency: req.body.currency,
      fromDate: req.body.fromDate,
      toDate: req.body.toDate,
    };
    const result = await this.listWithdrawal.execute(query);
    return {
      status: OK,
      data: {
        data: {
          count: result.count,
          withdrawals: result.withdrawals,
        },
      },
    };
  }

  schema: Schema = joi.object({
    page: joi.number().required(),
    pageSize: joi.number().required(),
    status: joi.array().optional(),
    currency: joi
      .string()
      .uppercase()
      .optional()
      .valid('EGP', 'AED', 'SAR'),
    fromDate: joi.string().optional(),
    toDate: joi.string().optional(),
  });
}


