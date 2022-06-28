import knex from 'knex';
const knexConfig = require('./knexfile');

const knexConnection = knex(knexConfig.development);

export { knexConnection };
