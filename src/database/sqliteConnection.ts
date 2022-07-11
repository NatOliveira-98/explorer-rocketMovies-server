import { connectToDB } from './sqlite';
import { createUsers } from './migrations/sqlite_createUsers';

export async function runMigrations() {
  const schemas = [createUsers].join('');

  connectToDB()
    .then((db: any) => db.exec(schemas))
    .catch((error: any) => console.error(error));
}
