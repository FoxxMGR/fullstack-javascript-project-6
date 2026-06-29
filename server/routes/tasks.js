// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const query = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]');

      const { statusId, executorId, creatorId, labelId } = req.query;
      const filters = { statusId: statusId || '', executorId: executorId || '', creatorId: creatorId || '', labelId: labelId || '' };

      if (statusId) {
        query.where('tasks.status_id', statusId);
      }
      if (executorId) {
        query.where('tasks.executor_id', executorId);
      }
      if (creatorId) {
        query.where('tasks.creator_id', creatorId);
      }
      if (labelId) {
        query.whereIn('tasks.id', app.objection.knex('task_labels').select('task_id').where('label_id', labelId));
      }

      const tasks = await query;
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const currentUser = req.user || null;
      reply.render('tasks/index', { tasks, statuses, users, labels, filters, currentUser });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', { task, statuses, users, labels });
      return reply;
    })
    .post('/tasks', { name: 'createTask' }, async (req, reply) => {
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const rawLabels = req.body.data.labels;
      const labelIds = Array.isArray(rawLabels) ? rawLabels.map(Number) : (rawLabels ? [Number(rawLabels)] : []);

      try {
        const errors = {};
        if (!req.body.data.name || req.body.data.name.trim().length === 0) {
          errors.name = [{ message: 'must NOT have fewer than 1 characters' }];
        }
        if (!req.body.data.description || req.body.data.description.trim().length === 0) {
          errors.description = [{ message: 'must NOT have fewer than 1 characters' }];
        }
        if (!req.body.data.statusId) {
          errors.statusId = [{ message: 'must be specified' }];
        }
        if (Object.keys(errors).length > 0) {
          const err = new Error('Validation failed');
          err.data = errors;
          throw err;
        }

        const statusId = Number(req.body.data.statusId);
        const executorId = req.body.data.executorId ? Number(req.body.data.executorId) : null;
        const [taskId] = await app.objection.knex('tasks').insert({
          name: req.body.data.name,
          description: req.body.data.description || '',
          status_id: statusId,
          creator_id: req.user.id,
          executor_id: executorId,
        });
        if (labelIds.length > 0) {
          const inserts = labelIds.map((id) => ({ task_id: taskId, label_id: id }));
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
        reply.render('tasks/new', { task, statuses, users, labels, errors });
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
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('[labels]');
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', { task, statuses, users, labels });
      return reply;
    })
    .post('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const rawLabels = req.body.data.labels;
      const labelIds = Array.isArray(rawLabels) ? rawLabels.map(Number) : (rawLabels ? [Number(rawLabels)] : []);

      try {
        await app.objection.knex('tasks').where('id', req.params.id).update({
          name: req.body.data.name,
          description: req.body.data.description || '',
          status_id: Number(req.body.data.statusId),
          executor_id: req.body.data.executorId ? Number(req.body.data.executorId) : null,
        });
        await app.objection.knex('task_labels').where('task_id', req.params.id).del();
        if (labelIds.length > 0) {
          const inserts = labelIds.map((id) => ({ task_id: Number(req.params.id), label_id: id }));
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
    .post('/tasks/:id/delete', { name: 'deleteTask' }, async (req, reply) => {
      try {
        await app.objection.knex('task_labels').where('task_id', req.params.id).del();
        await app.objection.knex('tasks').where('id', req.params.id).del();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Task delete failed');
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
