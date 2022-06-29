import { Router } from 'express';

import { UsersController } from '../controllers/UsersController';
import { ensureUserAuthentication } from '../middlewares/ensureUserAuthentication';

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/', ensureUserAuthentication, usersController.update);

export { usersRoutes };
