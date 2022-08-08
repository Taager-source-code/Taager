import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import joi from 'joi';
import { OK } from 'http-status';
import SearchInChildOrders from '../../../application/usecases/child-orders/SearchInChildOrders';
import { Container, Service } from 'typedi';
import ChildOrderRepoImpl from '../../repositories/ChildOrderRepoImpl';
import { SearchChildOrdersRequest } from '../../../application/models/child-orders/SearchChildOrdersRequest';
import { Request } from 'express';

@Service({ global: true })
export class SearchInChildOrdersController extends HttpProcessor {
  constructor() {
    super();
  }

  getValueToValidate(req: Request): any {
    return req.query;
  }

  async execute(req, joiValidatedValue): Promise<HttpSuccess | HttpError> {
    const searchInChildOrdersRequest: SearchChildOrdersRequest = {
      page: joiValidatedValue.page,
      pageSize: joiValidatedValue.pageSize,
      filter: joiValidatedValue.filter,
      taagerID: req.decodedToken.user.TagerID,
    };
    const getChildOrders = await new SearchInChildOrders(Container.of().get(ChildOrderRepoImpl)).execute(
      searchInChildOrdersRequest,
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
      filter: joi.string().allow(''),
    })
    .options({ allowUnknown: true, stripUnknown: true });
}


