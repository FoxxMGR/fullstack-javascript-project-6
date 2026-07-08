// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: 'integer' },
      },
    };
  }

  static applyFilters(query, filters, knex) {
    if (filters.statusId) {
      query.where('tasks.status_id', filters.statusId);
    }
    if (filters.executorId) {
      query.where('tasks.executor_id', filters.executorId);
    }
    if (filters.creatorId) {
      query.where('tasks.creator_id', filters.creatorId);
    }
    if (filters.labelIds && filters.labelIds.length > 0) {
      query.whereIn('tasks.id', knex('task_labels')
        .select('task_id')
        .whereIn('label_id', filters.labelIds));
    }
  }

  static get relationMappings() {
    const User = require('./User.cjs');
    const TaskStatus = require('./TaskStatus.cjs');
    const Label = require('./Label.cjs');

    return {
      status: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: TaskStatus,
        join: { from: 'tasks.status_id', to: 'task_statuses.id' },
      },
      creator: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'tasks.creator_id', to: 'users.id' },
      },
      executor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'tasks.executor_id', to: 'users.id' },
      },
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: { from: 'task_labels.task_id', to: 'task_labels.label_id' },
          to: 'labels.id',
        },
      },
    };
  }
};
