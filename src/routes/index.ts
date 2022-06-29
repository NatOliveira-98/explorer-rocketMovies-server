import { Router } from 'express';

import { usersRoutes } from './users.routes';
import { moviesNotesRoutes } from './moviesNotes.routes';
import { sessionsRoutes } from './sessions.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/movies', moviesNotesRoutes);

export { routes };
