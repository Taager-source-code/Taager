import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import joi from 'joi';
import { OK } from 'http-status';
import GetChildOrders from '../../../application/usecases/child-orders/GetChildOrders';
import { GetChildOrdersRequest } from '../../../application/models/child-orders/GetChildOrdersRequest';
import { Container, Service } from 'typedi';
import ChildOrderRepoImpl from '../../repositories/ChildOrderRepoImpl';
import { Request } from 'express';

@Service({ global: true })
export class GetChildOrdersController extends HttpProcessor {
  constructor() {
    super();
  }

  getValueToValidate(req: Request): any {
    return req.query;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    const getChildOrdersRequest: GetChildOrdersRequest = {
      page: joiValidatedValue.page,
      pageSize: joiValidatedValue.pageSize,
      queryOptions: {
        ...joiValidatedValue,
        taagerID: req.decodedToken.user.TagerID,
      },
    };
    const getChildOrders = await new GetChildOrders(Container.of().get(ChildOrderRepoImpl)).execute(
      getChildOrdersRequest,
    );
    return {
      status: OK,
      data: {
        data: getChildOrders.childOrders,
        count: getChildOrders.counted,
        endPages: getChildOrders.endflag,
      },
    };
  }

  schema = joi
    .object({
      pageSize: joi
        .number()
        .integer()
        .min(1)
        .default(10),
      page: joi
        .number()
        .integer()
        .default(1)
        .min(1),
      country: joi.string().optional(),
      status: joi.string().optional(),
      orderID: joi.string().optional(),
      parentOrderId: joi.string().optional(),
      fromDate: joi.string().optional(),
      toDate: joi.string().optional(),
    })
    .options({ allowUnknown: true, stripUnknown: true });
}


