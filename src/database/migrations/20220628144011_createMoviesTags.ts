import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('moviesTags', table => {
    table.increments('id');
    table
      .integer('note_id')
      .references('id')
      .inTable('moviesNotes')
      .onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users');
    table.text('name').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('moviesTags');
}
