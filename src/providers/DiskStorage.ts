import fs from 'fs';
import path from 'path';

import { uploadConfigs } from '../configs/upload';

export class DiskStorage {
  async saveFile(file: string) {
    await fs.promises.rename(
      path.resolve(uploadConfigs.TEMP_FOLDER, file),
      path.resolve(uploadConfigs.UPLOADS_FOLDER, file),
    );

    return file;
  }

  async deleteFile(file: string) {
    const filePath = path.resolve(uploadConfigs.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch (error) {
      console.log(error);
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
