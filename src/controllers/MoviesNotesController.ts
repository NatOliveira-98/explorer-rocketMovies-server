import { Request, Response } from 'express';

import { knexConnection } from '../database/knexConnection';
import { AppError, StatusCode } from '../exceptions/AppError';

export class MoviesNotesController {
  async create(req: Request | any, res: Response) {
    const { title, description, rating, tags } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
      throw new AppError({
        description: 'Favor insira uma nota entre 1 e 5',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

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

  async update(req: Request | any, res: Response) {
    const { title, description, rating, tags } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    const noteExists = await knexConnection('moviesNotes')
      .where({ id })
      .first();

    if (!noteExists) {
      throw new AppError({
        description: 'Nota não encontrada.',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    if (rating < 1 || rating > 5) {
      throw new AppError({
        description: 'Favor insira uma nota entre 1 e 5',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    noteExists.title = title ?? noteExists.title;
    noteExists.description = description ?? noteExists.description;
    noteExists.rating = rating ?? noteExists.rating;

    await knexConnection('moviesNotes').where({ id }).update({
      title: noteExists.title,
      description: noteExists.description,
      rating: noteExists.rating,
      updated_at: new Date().toISOString(),
    });

    const updatedTags = tags.map((name: string) => {
      return {
        name,
        note_id: id,
        user_id,
      };
    });

    await knexConnection('moviesTags').where({ note_id: id }).del(tags);
    await knexConnection('moviesTags').insert(updatedTags);

    return res.status(StatusCode.OK).json({ ...noteExists, updatedTags });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const note = await knexConnection('moviesNotes').where({ id }).first();
    const tags = await knexConnection('moviesTags')
      .where({ note_id: id })
      .orderBy('name');

    return res.status(StatusCode.OK).json({ ...note, tags });
  }

  async index(req: Request | any, res: Response) {
    const { title } = req.query;
    const user_id = req.user.id;

    const notes = await knexConnection('moviesNotes')
      .where({ user_id })
      .whereLike('title', `%${title}%`)
      .orderBy('title');

    const userTags = await knexConnection('moviesTags').where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      };
    });

    return res.status(StatusCode.OK).json(notesWithTags);
  }
}
