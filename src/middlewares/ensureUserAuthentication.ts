import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { authConfigs } from '../configs/auth';
import { AppError, StatusCode } from '../exceptions/AppError';

export function ensureUserAuthentication(
  req: Request | any,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError({
      description: 'JWT token não informado',
      httpCode: StatusCode.UNAUTHORIZED,
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(token, authConfigs.jwt.secret);

    req.user = {
      id: Number(user_id),
    };

    return next();
    //
  } catch (error) {
    throw new AppError({
      description: 'JWT token inválido',
      httpCode: StatusCode.UNAUTHORIZED,
    });
  }
}
