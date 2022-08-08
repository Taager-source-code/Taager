import multerS3 from '../shared-kernel/infrastructure/config/multer-s3';

const uploadS3 = (folder, acl, allowedTypes) => (req, res, next) =>
  multerS3(`${req.decodedToken.user.username}/${folder}`, acl, allowedTypes).single('file')(req, res, next);

export = uploadS3;


