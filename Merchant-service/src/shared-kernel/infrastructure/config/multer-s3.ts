import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { genToken } from '../../../authentication/commands/infrastructure/utils/encryption';
import Env from '../../../Env';

export default (folder, allowedTypes) =>
  multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        const dest = path.resolve(`./${Env.MEDIA_FOLDER}/${folder}`);
        fs.ensureDir(dest)
          .then(() => callback(null, dest))
          .catch(err => callback(err, ''));
      },
      filename(req, file, callback) {
        genToken(32, 'hex')
          .then(token => callback(null, `${token}.${file.mimetype.split('/')[1]}`))
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


