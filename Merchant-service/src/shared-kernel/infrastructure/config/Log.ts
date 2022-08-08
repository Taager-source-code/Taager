import winston from 'winston';
import { S3StreamLogger } from 's3-streamlogger';
import Env from '../../../Env';

const d = new Date();

// ---------------------------------Notification--------------------------------------

/**
 * getNotificationS3Stream - Get notification stream from S3.
 * @func
 * @param {Date} date - Date
 * @returns {any}
 */
const getNotificationS3Stream = date => {
  let NotificationS3Stream = new S3StreamLogger({
    bucket: Env.SPACES_BUCKET,
    name_format: '%Y-%m-%d-%H-%M-%S.log',
    folder: `notification_logs/${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`,
    rotate_every: 3600000,
    access_key_id: Env.SPACES_ACCESS_KEY,
    secret_access_key: Env.SPACES_SECRET_KEY,
  });

  const folder = `notification_logs/${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

  if (folder != NotificationS3Stream.folder) {
    NotificationS3Stream = new S3StreamLogger({
      bucket: Env.SPACES_BUCKET,
      name_format: '%Y-%m-%d-%H-%M-%S.log',
      folder: `notification_logs/${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`,
      rotate_every: 3600000,
      access_key_id: Env.SPACES_ACCESS_KEY,
      secret_access_key: Env.SPACES_SECRET_KEY,
    });

    return NotificationS3Stream;
  }

  return NotificationS3Stream;
};

/**
 * notificationLog - Create logger S3 stream for Notification.
 * @func
 * @param {Object} data - data object that have notification info data
 * @param {Date} date - Date
 * @param {Boolean} info - info [true by default] param for the winston package to log info
 * @returns {any}
 */
export const notificationLog = (data, date, info = true) => {
  const NotificationS3Stream = getNotificationS3Stream(date);

  const transport = new winston.transports.Stream({
    stream: NotificationS3Stream,
  });
  // see error handling section below
  transport.on('error', () => {
    /* ... */
  });

  const logger = winston.createLogger({
    transports: [transport],
  });

  if (info) logger.info(data);
  else logger.error(data);
};


