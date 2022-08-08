import { Service } from 'typedi';
import joi from 'joi';
import { OK } from 'http-status';
import { HttpError, HttpProcessor, HttpSuccess } from '../../../../common/http/HttpProcessor';
import GetCommercialCategoryHierarchy from '../../application/usecases/GetCommercialCategoryHierarchy';

@Service({ global: true })
export default class GetCommercialCategoryHierarchyController extends HttpProcessor {
  private getCommercialCategoryHierarchy: GetCommercialCategoryHierarchy;

  constructor(getRootCommercialCategories: GetCommercialCategoryHierarchy) {
    super();
    this.getCommercialCategoryHierarchy = getRootCommercialCategories;
  }

  schema = joi.object();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(req, joiValue): Promise<HttpSuccess | HttpError> {
    const country = req.country.countryIsoCode3;
    const categories = await this.getCommercialCategoryHierarchy.execute(country);
    return { status: OK, data: categories };
  }
}


