import multer from 'multer';

import multerS3 from 'multer-s3';

import { s3 } from './aws-sdk';

import { genToken } from '../../../authentication/commands/infrastructure/utils/encryption';
import Env from '../../../Env';

export = (folder, acl, allowedTypes) =>
  multer({
    storage: multerS3({
      s3,
      bucket: Env.SPACES_BUCKET,
      acl,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata(req, file, callback) {
        callback(null, file);
      },
      key(req, file, callback) {
        genToken(32, 'hex')
          .then(token => callback(null, `${folder}/${token}.${file.mimetype.split('/')[1]}`))
          .catch(err => callback(err, ''));
      },
    }),
    fileFilter(req, file, callback) {
      const typeArray = file.mimetype.split('/');
      callback(
        null,
        allowedTypes.length ? allowedTypes.includes(typeArray[0]) || allowedTypes.includes(typeArray[1]) : true,
      );
    },
  });


