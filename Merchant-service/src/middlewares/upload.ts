import multer from '../shared-kernel/infrastructure/config/multer';

const upload = (folder, allowedTypes) => (req, res, next) =>
  multer(`${req.decodedToken.user.username}/${folder}`, allowedTypes).single('file')(req, res, next);

export default upload;


