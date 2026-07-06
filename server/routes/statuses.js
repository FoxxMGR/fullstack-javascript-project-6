// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.taskStatus.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new app.objection.models.taskStatus();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new app.objection.models.taskStatus();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.taskStatus.fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Status creation failed');
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: err.data });
      }

      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await app.objection.models.taskStatus.query().findById(req.params.id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses/:id', { name: 'updateStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await app.objection.models.taskStatus.query().findById(req.params.id);
      try {
        await status.$query().patch({ name: req.body.data.name });
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Status update failed');
        reply.render('statuses/edit', { status, errors: err.data });
      }

      return reply;
    })
    .post('/statuses/:id/delete', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const status = await app.objection.models.taskStatus.query().findById(req.params.id);
        const hasTasks = await status.$relatedQuery('tasks').first();
        if (hasTasks) {
          req.flash('error', i18next.t('flash.statuses.delete.error'));
          reply.redirect(app.reverse('statuses'));
          return reply;
        }
        await status.$query().delete();
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Status delete failed');
      }

      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
