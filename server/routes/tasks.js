// @ts-check

import i18next from 'i18next';

const parseLabelIds = (rawLabels) => {
  if (Array.isArray(rawLabels)) return rawLabels.map(Number);
  if (rawLabels) return [Number(rawLabels)];
  return [];
};

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
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const currentUser = req.user || null;
      reply.render('tasks/index', {
        tasks, statuses, users, labels, filters, currentUser,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const labelIds = parseLabelIds(req.body.data.labels);

      try {
        const task = await app.objection.models.task.query().insert({
          name: req.body.data.name,
          description: req.body.data.description || '',
          statusId: Number(req.body.data.statusId),
          creatorId: req.user.id,
          executorId: req.body.data.executorId
            ? Number(req.body.data.executorId) : null,
        });
        if (labelIds.length > 0) {
          const inserts = labelIds.map((id) => ({ task_id: task.id, label_id: id }));
          await app.objection.knex('task_labels').insert(inserts);
        }
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Task creation failed');
        const task = new app.objection.models.task();
        task.$set(req.body.data);
        const errors = err.data || {};
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task, statuses, users, labels, errors,
        });
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
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .post('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const labelIds = parseLabelIds(req.body.data.labels);

      try {
        const task = await app.objection.models.task.query()
          .findById(req.params.id);
        await task.$query().patch({
          name: req.body.data.name,
          description: req.body.data.description || '',
          statusId: Number(req.body.data.statusId),
          executorId: req.body.data.executorId
            ? Number(req.body.data.executorId) : null,
        });
        await task.$relatedQuery('labels').unrelate();
        if (labelIds.length > 0) {
          const inserts = labelIds.map((id) => ({ task_id: task.id, label_id: id }));
          await app.objection.knex('task_labels').insert(inserts);
        }
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
        const task = await app.objection.models.task.query()
          .findById(req.params.id);
        await task.$relatedQuery('labels').unrelate();
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Task delete failed');
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
