import { Router } from 'express';
import multer from 'multer';

import { UsersController } from '../controllers/UsersController';
import { UsersAvatarController } from '../controllers/UsersAvatarController';
import { ensureUserAuthentication } from '../middlewares/ensureUserAuthentication';
import { uploadConfigs } from '../configs/upload';

const usersRoutes = Router();
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfigs.MULTER);

usersRoutes.post('/', usersController.create);
usersRoutes.put('/', ensureUserAuthentication, usersController.update);
usersRoutes.patch(
  '/avatar',
  ensureUserAuthentication,
  upload.single('avatar'),
  usersAvatarController.update,
);

export { usersRoutes };
