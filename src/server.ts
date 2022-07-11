import 'express-async-errors';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { connectToDB } from './database/sqlite';
import { AppError, StatusCode } from './exceptions/AppError';
import { uploadConfigs } from './configs/upload';

import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfigs.UPLOADS_FOLDER));
app.use(routes);

connectToDB();

// error middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(StatusCode.BAD_REQUEST).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return res
    .status(StatusCode.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error' });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Server is running');
});
