import path from 'path';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function connectToDB() {
  const db = await open({
    filename: path.resolve(__dirname, 'database.db'),
    driver: sqlite3.Database,
  });

  return db;
}

export { connectToDB };
