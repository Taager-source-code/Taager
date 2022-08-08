import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import Env from '../../../Env';

aws.config.update({
  secretAccessKey: Env.SPACES_SECRET_KEY,
  accessKeyId: Env.SPACES_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new aws.S3();
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'video/quicktime' ||
    file.mimetype === 'video/mp4'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only PNG and JPEG allowed'), false);
  }
};

const extractExtensionByFileName = file => {
  const extensionPattern = /\.[0-9a-z]+$/i;
  const matches = file.originalname.match(extensionPattern);

  if (matches && matches.length > 0) {
    return matches[0];
  }
  return null;
};

const extractExtensionByMimeType = file => {
  switch (file.mimetype) {
    case 'image/jpeg':
      return '.jpeg';
    case 'image/png':
      return '.png';
    case 'video/quicktime':
      return '.mov';
    case 'video/mp4':
      return '.mp4';
    default:
      return '.taager';
  }
};

const extractExtension = file => {
  const extensionByFile = extractExtensionByFileName(file);
  if (extensionByFile != null) {
    return extensionByFile;
  }
  return extractExtensionByMimeType(file);
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'tager-uploads',
    metadata(req, file, cb) {
      cb(null, { fieldName: 'Testing Metadata' });
    },
    key(req, file, cb) {
      cb(null, `${uuidv4()}${extractExtension(file)}`);
    },
  }),
});

export default upload;


