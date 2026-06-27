// @ts-check

export const up = (knex) => (
  knex.schema.createTable('task_labels', (table) => {
    table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
    table.integer('label_id').unsigned().references('id').inTable('labels').onDelete('CASCADE');
    table.primary(['task_id', 'label_id']);
  })
);

export const down = (knex) => knex.schema.dropTable('task_labels');
