import { HttpError, HttpProcessor, HttpSuccess } from '../../../../../common/http/HttpProcessor';
import { Container, Service } from 'typedi';
import { NOT_FOUND, OK } from 'http-status';
import joi from 'joi';
import GetProvinces from '../../../application/usecases/province/GetProvinces';
import ProvinceRepoImpl from '../../repositories/ProvinceRepoImpl';

@Service({ global: true })
export class GetProvincesController extends HttpProcessor {
  constructor() {
    super();
  }

  async execute(req: any): Promise<HttpSuccess | HttpError> {
    const response = await new GetProvinces(Container.of().get(ProvinceRepoImpl)).execute(req.country.countryIsoCode3);
    if (response) {
      return {
        status: OK,
        data: {
          msg: 'provinces list found!',
          data: response,
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


