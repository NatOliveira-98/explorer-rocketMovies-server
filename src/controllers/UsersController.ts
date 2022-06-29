import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';

import { connectToDB } from '../database/sqlite';
import { AppError, StatusCode } from '../exceptions/AppError';

export class UsersController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const db = await connectToDB();

    const userAlreadyExists = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email],
    );

    if (userAlreadyExists) {
      throw new AppError({
        description: 'Este e-mail já está cadastrado',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    const hashedPassword = await hash(password, 8);

    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    return res.status(StatusCode.CREATED).json();
  }

  async update(req: Request | any, res: Response) {
    const { name, email, currentPassword, newPassword } = req.body;
    const user_id = req.user.id;

    const db = await connectToDB();

    const userExists = await db.get('SELECT * FROM users WHERE id = (?)', [
      user_id,
    ]);

    if (!userExists) {
      throw new AppError({
        description: 'Usuário não encontrado.',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    const userWithUpdatedEmail = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email],
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== userExists.id) {
      throw new AppError({
        description: 'Este e-mail já está em uso.',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    userExists.name = name ?? userExists.name;
    userExists.email = email ?? userExists.email;

    if (newPassword && !currentPassword) {
      throw new AppError({
        description:
          'Por favor, informe sua senha atual para que possa atualizá-la.',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    if (newPassword && currentPassword) {
      const checkCurrentPassword = await compare(
        currentPassword,
        userExists.password,
      );

      if (!checkCurrentPassword) {
        throw new AppError({
          description: 'A senha informada não confere.',
          httpCode: StatusCode.BAD_REQUEST,
        });
      }

      userExists.password = await hash(newPassword, 8);
    }

    if (!currentPassword) {
      throw new AppError({
        description:
          'Informe sua senha para que possa atualizar os seus dados.',
        httpCode: StatusCode.BAD_REQUEST,
      });
    }

    await db.run(
      `UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?`,
      [userExists.name, userExists.email, userExists.password, user_id],
    );

    return res.status(StatusCode.OK).json();
  }
}
