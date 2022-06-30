import { Request, Response } from 'express';

import { knexConnection } from '../database/knexConnection';
import { DiskStorage } from '../providers/DiskStorage';
import { AppError, StatusCode } from '../exceptions/AppError';

export class UsersAvatarController {
  async update(req: Request | any, res: Response) {
    const user_id = req.user.id;
    const avatarFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const userExists = await knexConnection('users')
      .where({ id: user_id })
      .first();

    if (!userExists) {
      throw new AppError({
        description: 'Somente usuários autenticados podem trocar o avatar',
        httpCode: StatusCode.UNAUTHORIZED,
      });
    }

    console.log(userExists.avatar);

    if (userExists.avatar) {
      await diskStorage.deleteFile(userExists.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    userExists.avatar = filename;

    await knexConnection('users').update(userExists).where({ id: user_id });

    return res.status(StatusCode.OK).json(userExists);
  }
}
