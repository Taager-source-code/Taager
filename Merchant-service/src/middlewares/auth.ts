import { UNAUTHORIZED } from 'http-status';

import { extractToken, isAuthenticated } from '../authentication/commands/application/usecases/auth.service';

export default async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  try {
    req.decodedToken = await isAuthenticated(token);
    next();
  } catch (err) {
    next({
      statusCode: UNAUTHORIZED,
      msg: 'Token Error',
    });
  }
};


