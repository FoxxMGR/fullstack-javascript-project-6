// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('status_id').unsigned().references('id').inTable('task_statuses');
    table.integer('creator_id').unsigned().references('id').inTable('users');
    table.integer('executor_id').unsigned().references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
    .createTable('task_labels', (table) => {
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
      table.integer('label_id').unsigned().references('id').inTable('labels').onDelete('CASCADE');
      table.primary(['task_id', 'label_id']);
    })
);

export const down = (knex) => (
  knex.schema.dropTable('task_labels')
    .dropTable('tasks')
);
