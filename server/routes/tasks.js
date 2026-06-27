// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const { statusId, executorId, labelId, isCreatorUser } = req.query;
      const query = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]');

      if (statusId) {
        query.where('tasks.status_id', statusId);
      }
      if (executorId) {
        query.where('tasks.executor_id', executorId);
      }
      if (labelId) {
        query.where('tasks.id', app.objection.models.task.query()
          .select('task_id')
          .from('task_labels')
          .where('label_id', labelId));
      }
      if (isCreatorUser === 'on' && req.user) {
        query.where('tasks.creator_id', req.user.id);
      }

      const tasks = await query;
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', {
        tasks, statuses, users, labels,
        filter: { statusId, executorId, labelId, isCreatorUser },
      });
      return reply;
    })
    .get('/tasks/new', {
      name: 'newTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', { task, statuses, users, labels });
    })
    .get('/tasks/:id', { name: 'showTask' }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query()
        .findById(id)
        .withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/show', { task });
      return reply;
    })
    .get('/tasks/:id/edit', {
      name: 'editTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query()
        .findById(id)
        .withGraphJoined('labels');
      const statuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/edit', { task, statuses, users, labels });
      return reply;
    })
    .post('/tasks', {
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const { labelIds, ...taskData } = req.body.data;
      const insertData = {
        ...taskData,
        creatorId: req.user.id,
      };

      try {
        const validTask = await app.objection.models.task.fromJson(insertData);
        const task = await app.objection.models.task.query().insert(validTask);
        if (labelIds && labelIds.length > 0) {
          await task.$relatedQuery('labels').relate(labelIds);
        }
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        const statuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        const task = new app.objection.models.task();
        task.$set(req.body.data);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, statuses, users, labels, errors: data });
      }

      return reply;
    })
    .patch('/tasks/:id', {
      name: 'patchTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const { id } = req.params;
      const { labelIds, ...taskData } = req.body.data;

      try {
        const task = await app.objection.models.task.query().findById(id);
        await task.$query().patch(taskData);
        await task.$relatedQuery('labels').unrelate();
        if (labelIds && labelIds.length > 0) {
          await task.$relatedQuery('labels').relate(labelIds);
        }
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        const task = await app.objection.models.task.query().findById(id);
        const statuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.update.error'));
        reply.render('tasks/edit', { task, statuses, users, labels, errors: data });
      }

      return reply;
    })
    .delete('/tasks/:id', {
      name: 'deleteTask',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      const { id } = req.params;

      try {
        const task = await app.objection.models.task.query().findById(id);
        if (task.creatorId !== req.user.id) {
          req.flash('error', i18next.t('flash.authError'));
          reply.redirect(app.reverse('tasks'));
          return reply;
        }
        await app.objection.models.task.query().deleteById(id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }

      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
