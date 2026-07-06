// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class TaskStatus extends BaseModel {
  static get tableName() {
    return 'task_statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    const Task = require('./Task.cjs');

    return {
      tasks: {
        relation: BaseModel.HasManyRelation,
        modelClass: Task,
        join: { from: 'task_statuses.id', to: 'tasks.status_id' },
      },
    };
  }
};
