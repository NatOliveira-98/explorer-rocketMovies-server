import { Request, Response } from 'express';

import { knexConnection } from '../database/knexConnection';
import { StatusCode } from '../exceptions/AppError';

export class MoviesNotesController {
  async create(req: Request, res: Response) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const note_id = await knexConnection('moviesNotes').insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name: string) => {
      return {
        name,
        note_id,
        user_id,
      };
    });

    await knexConnection('moviesTags').insert(tagsInsert);

    return res.status(StatusCode.CREATED).json();
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await knexConnection('moviesNotes').where({ id }).delete();

    return res
      .status(StatusCode.OK)
      .json({ message: 'Anotações do filme foram deletadas' });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const note = await knexConnection('moviesNotes').where({ id }).first();
    const tags = await knexConnection('moviesTags')
      .where({ note_id: id })
      .orderBy('name');

    return res.status(StatusCode.OK).json({ ...note, tags });
  }

  async index(req: Request, res: Response) {
    const { title, user_id } = req.query;

    const notes = await knexConnection('moviesNotes')
      .where({ user_id })
      .whereLike('title', `%${title}%`)
      .orderBy('title');

    return res.status(StatusCode.OK).json(notes);
  }
}
