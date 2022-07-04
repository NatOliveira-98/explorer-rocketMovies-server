import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { authConfigs } from '../configs/auth';
import { knexConnection } from '../database/knexConnection';
import { AppError, StatusCode } from '../exceptions/AppError';

export class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExists = await knexConnection('users').where({ email }).first();

    if (!userExists) {
      throw new AppError({
        description: 'e-mail e/ou senha incorreto',
        httpCode: StatusCode.UNAUTHORIZED,
      });
    }

    const passwordMatched = await compare(password, userExists.password);

    if (!passwordMatched) {
      throw new AppError({
        description: 'e-mail e/ou senha incorreto',
        httpCode: StatusCode.UNAUTHORIZED,
      });
    }

    const { secret, expiresIn } = authConfigs.jwt;
    const token = sign({}, secret, {
      subject: String(userExists.id),
      expiresIn,
    });

    return res.status(StatusCode.CREATED).json({ userExists, token });
  }
}
