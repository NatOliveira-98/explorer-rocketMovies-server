import { Request, Response } from 'express';

import { AppError, StatusCode } from '../exceptions/AppError';

export class UsersController {
  create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError({
        description: 'Nome é obrigatório',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    res.status(StatusCode.CREATED).json({
      name,
      email,
      password,
    });
  }
}
