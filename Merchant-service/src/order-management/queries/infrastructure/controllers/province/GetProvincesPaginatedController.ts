import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Container, Service } from 'typedi';
import { NOT_FOUND, OK } from 'http-status';
import joi from 'joi';
import ProvinceRepoImpl from '../../repositories/ProvinceRepoImpl';
import { GetProvincesPaginatedRequest } from '../../../application/models/province/GetProvincesPaginatedRequest';
import GetProvincesPaginated from '../../../application/usecases/province/GetProvincesPaginated';

@Service({ global: true })
export class GetProvincesPaginatedController extends HttpProcessor {
  constructor() {
    super();
  }

  async execute(req: any): Promise<HttpSuccess | HttpError> {
    const getProvincesPaginatedRequest: GetProvincesPaginatedRequest = {
      page: +(req.query.page - 1),
      pageSize: +req.query.pageSize,
      country: req.country.countryIsoCode3,
    };
    const response = await new GetProvincesPaginated(Container.of().get(ProvinceRepoImpl)).execute(
      getProvincesPaginatedRequest,
    );
    if (response) {
      return {
        status: OK,
        data: {
          msg: 'provinces list found!',
          data: response.data,
          count: response.count,
          endPages: response.endPages,
        },
      };
    }

    return {
      status: NOT_FOUND,
      errorCode: NOT_FOUND.toString(),
      description: 'No provinces found',
      message: "Provinces can't be retrieved",
    };
  }

  schema = joi.object().options({ allowUnknown: true, stripUnknown: true });
}


