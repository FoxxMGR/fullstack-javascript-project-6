// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/index', { tasks });
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
      const task = new app.objection.models.task();
      task.$set(req.body.data);
      const labelIds = req.body.data.labels || [];

      try {
        const validTask = await app.objection.models.task.fromJson({
          name: req.body.data.name,
          description: req.body.data.description || '',
          statusId: Number(req.body.data.statusId),
          creatorId: req.user.id,
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
        });
        const insertedTask = await app.objection.models.task.query().insert(validTask);
        if (labelIds.length > 0) {
          await insertedTask.$relatedQuery('labels').relate(labelIds);
        }
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Task creation failed');
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const statuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/new', { task, statuses, users, labels, errors: err.data });
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
      const task = await app.objection.models.task.query().findById(req.params.id);
      const labelIds = req.body.data.labels || [];

      try {
        await task.$query().patch({
          name: req.body.data.name,
          description: req.body.data.description || '',
          statusId: Number(req.body.data.statusId),
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
        });
        await task.$relatedQuery('labels').unrelate();
        if (labelIds.length > 0) {
          await task.$relatedQuery('labels').relate(labelIds);
        }
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Task update failed');
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const statuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        reply.render('tasks/edit', { task, statuses, users, labels, errors: err.data });
      }

      return reply;
    })
    .post('/tasks/:id/delete', { name: 'deleteTask' }, async (req, reply) => {
      try {
        await app.objection.models.task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Task delete failed');
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
