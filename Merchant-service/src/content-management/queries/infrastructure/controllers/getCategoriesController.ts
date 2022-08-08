import { OK, UNPROCESSABLE_ENTITY } from 'http-status';
import GetCategories from '../../application/usecases/getCategories';
import { Container } from 'typedi';
import { Category } from '../../../common/infrastructure/db/models/categoryModel';
import { featuredValidator } from '../validators/featuredValidator';

const container = Container.of();

function mapToHttpResponse(getCategoriesResponse: Category[]) {
  return getCategoriesResponse.map(categoryResponse => ({
    _id: categoryResponse._id,
    name: categoryResponse.name,
    text: categoryResponse.text,
    icon: categoryResponse.icon,
    sorting: categoryResponse.sorting,
    featured: categoryResponse.featured,
    country: categoryResponse.country,
    updatedAt: categoryResponse.updatedAt,
    createdAt: categoryResponse.createdAt,
  }));
}

function handleSuccess(res, getCategoriesResponse) {
  if (getCategoriesResponse.length > 0) {
    res.status(OK).json({
      msg: 'Categories list found!',
      data: mapToHttpResponse(getCategoriesResponse),
    });
  } else {
    res.status(OK).json({
      msg: 'No Categories found',
      data: mapToHttpResponse(getCategoriesResponse),
    });
  }
}

function handleFailure(res, error) {
  res.status(UNPROCESSABLE_ENTITY).json({
    msg: error.details[0].message,
  });
}

export const execute = async (req, res) => {
  const getCategories = container.get(GetCategories);

  const { error: errorFeatured, value: valueFeatured } = featuredValidator(req);

  if (errorFeatured) {
    return handleFailure(res, errorFeatured);
  }

  const queryParametersObject = {
    ...valueFeatured,
    country: req.country.countryIsoCode3,
  };

  const getCategoriesResponse = await getCategories.execute(queryParametersObject);

  return handleSuccess(res, getCategoriesResponse);
};


