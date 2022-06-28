import { Router } from 'express';

import { MoviesNotesController } from '../controllers/MoviesNotesController';

const moviesNotesRoutes = Router();
const moviesNotesController = new MoviesNotesController();

moviesNotesRoutes.post('/create/:user_id', moviesNotesController.create);
moviesNotesRoutes.delete('/preview/:id', moviesNotesController.delete);
moviesNotesRoutes.get('/preview/:id', moviesNotesController.show);
moviesNotesRoutes.get('/', moviesNotesController.index);

export { moviesNotesRoutes };
