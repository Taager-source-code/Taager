import { FORBIDDEN, UNAUTHORIZED } from 'http-status';

import { extractToken, isAuthenticated } from '../authentication/commands/application/usecases/auth.service';
import { designatedUserLevel } from '../authentication/commands/domain/models/userLevel';

export default async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  try {
    req.decodedToken = await isAuthenticated(token);
    if (req.decodedToken.user.userLevel == designatedUserLevel.MERCHANT_USER) {
      return next({
        statusCode: FORBIDDEN,
        msg: 'Not allowed to do this action',
      });
    }
    next();
  } catch (err) {
    next({
      statusCode: UNAUTHORIZED,
      msg: 'Token Error',
    });
  }
};


