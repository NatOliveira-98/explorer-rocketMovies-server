import type { Knex } from 'knex';
import path from 'path';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'database.db'),
    },
    pool: {
      afterCreate: (connection: any, callback: any) =>
        connection.run('PRAGMA foreign_keys = ON', callback),
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations'),
    },
    useNullAsDefault: true,
  },
};

module.exports = knexConfig;
