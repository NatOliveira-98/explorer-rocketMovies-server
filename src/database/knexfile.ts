import type { Knex } from 'knex';
import path from 'path';

// interface KnexConfigInterface {
// [key: string]: object;
// }

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'database.db'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
    },
    useNullAsDefault: true,
  },
};

module.exports = knexConfig;
