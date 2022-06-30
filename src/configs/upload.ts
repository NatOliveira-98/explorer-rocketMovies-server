import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const TEMP_FOLDER = path.resolve(__dirname, '..', 'temp');
const UPLOADS_FOLDER = path.resolve(TEMP_FOLDER, 'uploads');

const MULTER = {
  storage: multer.diskStorage({
    destination: TEMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const hashedFilename = `${fileHash}-${file.originalname}`;

      return callback(null, hashedFilename);
    },
  }),
};

export const uploadConfigs = {
  TEMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
};
