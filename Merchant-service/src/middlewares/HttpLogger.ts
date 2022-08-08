import { v4 as Uuid } from 'uuid';
import Logger from '../shared-kernel/infrastructure/logging/general.log';
import { getFormattedDate } from '../shared-kernel/infrastructure/utils/date';

function getTaagerId(req): string {
  if (req.headers.authorization) {
    const decodedToken = Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString();
    return String(JSON.parse(decodedToken).user.TagerID);
  }
  return 'anonymous';
}

function logRequest(req, logParams) {
  Logger.info('Request triggered', {
    traceId: logParams.traceId,
    timeStamp: `[${getFormattedDate()}]`,
    request: {
      method: req.method,
      url: req.url,
      taagerId: logParams.taagerId,
    },
  });
}

function logResponse(req, res, logParams) {
  Logger.info('Response triggered', {
    traceId: logParams.traceId,
    timeStamp: `[${getFormattedDate()}]`,
    request: {
      method: req.method,
      url: req.url,
      taagerId: logParams.taagerId,
    },
    response: {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    },
  });
}

function logError(err) {
  Logger.error('Error encountered by HttpLogger middleware', {
    error: err,
  });
}

export default async (req, res, next) => {
  try {
    const logParams = {
      taagerId: getTaagerId(req),
      traceId: Uuid(),
    };
    logRequest(req, logParams);
    res.on('finish', () => logResponse(req, res, logParams));
    next();
  } catch (err) {
    logError(err);
    next();
  }
};


