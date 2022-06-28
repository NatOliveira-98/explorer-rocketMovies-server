import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { moviesNotesRoutes } from './moviesNotes.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/movies', moviesNotesRoutes);

export { routes };
