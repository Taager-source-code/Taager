import { Container } from 'typedi';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import CountryRepo from '../shared-kernel/infrastructure/repositories/CountryRepo';
import Logger from '../shared-kernel/infrastructure/logging/general.log';

export default async (req, res, next) => {
  const countryIsoCode = req.headers.country === undefined ? 'EGY' : req.headers.country.toUpperCase();

  try {
    const country = await Container.of()
      .get(CountryRepo)
      .getByIsoCode(countryIsoCode);

    if (!country) {
      next({
        statusCode: BAD_REQUEST,
        msg: `Invalid country header: ${countryIsoCode}`,
      });

      Logger.warn('Invalid country header', { country: countryIsoCode });
    } else {
      req.country = country;
      return next();
    }
  } catch (err) {
    Logger.error(`Error while handling country header: ${(err as Error).stack}`);

    next({
      statusCode: INTERNAL_SERVER_ERROR,
      msg: `Error while handling country header`,
    });
  }
};


