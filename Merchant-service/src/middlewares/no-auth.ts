import { FORBIDDEN } from 'http-status';
import { extractToken, isNotAuthenticated } from '../authentication/commands/application/usecases/auth.service';

export default async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  try {
    await isNotAuthenticated(token);
    next();
  } catch (err) {
    next({
      statusCode: FORBIDDEN,
      msg: 'You are already authenticated',
    });
  }
};


