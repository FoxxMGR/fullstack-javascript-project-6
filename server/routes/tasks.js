// @ts-check

import i18next from 'i18next';

const parseLabelIds = (rawLabels) => {
  if (Array.isArray(rawLabels)) return rawLabels.map(Number);
  if (rawLabels) return [Number(rawLabels)];
  return [];
};

const loadFormData = async (app) => {
  const statuses = await app.objection.models.taskStatus.query();
  const users = await app.objection.models.user.query();
  const labels = await app.objection.models.label.query();
  return { statuses, users, labels };
};

const insertLabels = async (knex, taskId, labelIds) => {
  if (labelIds.length > 0) {
    const inserts = labelIds.map((id) => ({ task_id: taskId, label_id: id }));
    await knex('task_labels').insert(inserts);
  }
};

const validateTaskData = (data) => {
  const errors = {};
  if (!data.name || data.name.trim().length === 0) {
    errors.name = [{ message: 'must NOT have fewer than 1 characters' }];
  }
  if (!data.description || data.description.trim().length === 0) {
    errors.description = [{ message: 'must NOT have fewer than 1 characters' }];
  }
  if (!data.statusId) {
    errors.statusId = [{ message: 'must be specified' }];
  }
  return errors;
};

const buildTaskData = (data, creatorId) => ({
  name: data.name,
  description: data.description || '',
  status_id: Number(data.statusId),
  creator_id: creatorId,
  executor_id: data.executorId ? Number(data.executorId) : null,
});

const applyFilters = (query, filters, knex) => {
  query.modify((builder) => {
    if (filters.statusId) {
      builder.where('tasks.status_id', filters.statusId);
    }
    if (filters.executorId) {
      builder.where('tasks.executor_id', filters.executorId);
    }
    if (filters.creatorId) {
      builder.where('tasks.creator_id', filters.creatorId);
    }
    if (filters.labelId) {
      builder.whereIn('tasks.id', knex('task_labels')
        .select('task_id').where('label_id', filters.labelId));
    }
  });
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const {
        statusId, executorId, creatorId, labelId,
      } = req.query;
      const filters = {
        statusId: statusId || '',
        executorId: executorId || '',
        creatorId: creatorId || '',
        labelId: labelId || '',
      };

      const query = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]');
      applyFilters(query, filters, app.objection.knex);

      const tasks = await query;
      const { statuses, users, labels } = await loadFormData(app);
      const currentUser = req.user || null;
      reply.render('tasks/index', {
        tasks, statuses, users, labels, filters, currentUser,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const { statuses, users, labels } = await loadFormData(app);
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      const { statuses, users, labels } = await loadFormData(app);
      const labelIds = parseLabelIds(req.body.data.labels);

      const errors = validateTaskData(req.body.data);
      if (Object.keys(errors).length > 0) {
        const task = new app.objection.models.task();
        task.$set(req.body.data);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task, statuses, users, labels, errors,
        });
        return reply;
      }

      try {
        const [taskId] = await app.objection.knex('tasks')
          .insert(buildTaskData(req.body.data, req.user.id));
        await insertLabels(app.objection.knex, taskId, labelIds);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Task creation failed');
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.redirect(app.reverse('tasks'));
      }

      return reply;
    })
    .get('/tasks/:id', { name: 'showTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('[labels]');
      const { statuses, users, labels } = await loadFormData(app);
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const labelIds = parseLabelIds(req.body.data.labels);

      try {
        const taskData = buildTaskData(req.body.data);
        delete taskData.creator_id;
        await app.objection.knex('tasks')
          .where('id', req.params.id).update(taskData);
        await app.objection.knex('task_labels')
          .where('task_id', req.params.id).del();
        await insertLabels(app.objection.knex, Number(req.params.id), labelIds);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Task update failed');
        req.flash('error', i18next.t('flash.tasks.update.error'));
        reply.redirect(app.reverse('tasks'));
      }

      return reply;
    })
    .post('/tasks/:id/delete', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      try {
        await app.objection.knex('task_labels')
          .where('task_id', req.params.id).del();
        await app.objection.knex('tasks')
          .where('id', req.params.id).del();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Task delete failed');
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
