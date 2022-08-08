import { OK } from 'http-status';
import GetShoppingSummary from '../../application/usecases/GetShoppingSummary';
import CartRepository from '../repositories/CartRepo';
import CatalogRepo from '../repositories/CatalogRepo';
import GetShoppingSummaryRequest from '../../application/models/GetShoppingSummaryRequest';

const mapToHttpResponse = getMerchantSummaryResponse => ({
  merchantShoppingSummary: {
    cartCount: getMerchantSummaryResponse.cartSummary,
    catalogCount: getMerchantSummaryResponse.catalogSummary,
  },
});

export const execute = async (req, res) => {
  const request: GetShoppingSummaryRequest = {
    tagerId: req.decodedToken.user.TagerID,
    id: req.decodedToken.user._id,
    country: req.country.countryIsoCode3,
  };

  const cartRepository = new CartRepository();
  const catalogRepository = new CatalogRepo();
  const getShoppingSummary = new GetShoppingSummary(cartRepository, catalogRepository);

  const result = await getShoppingSummary.execute(request);

  return res.status(OK).json(mapToHttpResponse(result));
};


