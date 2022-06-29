import { Router } from 'express';

import { MoviesNotesController } from '../controllers/MoviesNotesController';
import { ensureUserAuthentication } from '../middlewares/ensureUserAuthentication';

const moviesNotesRoutes = Router();
const moviesNotesController = new MoviesNotesController();

moviesNotesRoutes.use(ensureUserAuthentication);

moviesNotesRoutes.post('/create', moviesNotesController.create);
moviesNotesRoutes.delete('/preview/:id', moviesNotesController.delete);
moviesNotesRoutes.put('/edit/:id', moviesNotesController.update);
moviesNotesRoutes.get('/preview/:id', moviesNotesController.show);
moviesNotesRoutes.get('/', moviesNotesController.index);

export { moviesNotesRoutes };
