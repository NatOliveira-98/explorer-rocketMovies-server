import knex from 'knex';
const knexConfig = require('./knexfile');

const knexConnection = knex(knexConfig.development);

export { knexConnection };

// to create migrations
// npx knex migrate:make migrationName --knexfile=./src/database/knexfile.ts
// npx knex migrate:latest --knexfile=./src/database/knexfile.ts
