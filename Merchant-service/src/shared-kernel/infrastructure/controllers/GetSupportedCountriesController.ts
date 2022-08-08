import { OK } from 'http-status';
import GetSupportedCountries from '../../application/usecases/GetSupportedCountries';
import { Country } from '../db/models/Country';
import { Container } from 'typedi';

const container = Container.of();

/**
 *
 * @param getCountriesResponse
 */
function mapToHttpResponse(getCountriesResponse: Country[]) {
  return getCountriesResponse.map(countryResponse => ({
    countryIsoCode2: countryResponse.countryIsoCode2,
    countryIsoCode3: countryResponse.countryIsoCode3,
    countryIsoNumber: countryResponse.countryIsoNumber,
    currencyIsoCode: countryResponse.currencyIsoCode,
  }));
}

function handleSuccess(res, getCountriesResponse) {
  res.status(OK).json({
    msg: 'success',
    data: mapToHttpResponse(getCountriesResponse),
  });
}

export const execute = async (req, res) => {
  const getSupportedCountries = container.get(GetSupportedCountries);
  const getCountiesResponse = await getSupportedCountries.execute(req.decodedToken.user.TagerID);

  return handleSuccess(res, getCountiesResponse);
};


