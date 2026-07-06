// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Label creation failed');
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: err.data });
      }

      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels/:id', { name: 'updateLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      try {
        await label.$query().patch({ name: req.body.data.name });
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('labels'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'Label update failed');
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.redirect(app.reverse('labels'));
      }

      return reply;
    })
    .post('/labels/:id/delete', { name: 'deleteLabel', preValidation: app.authenticate }, async (req, reply) => {
      try {
        await app.objection.models.label.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'Label delete failed');
      }

      reply.redirect(app.reverse('labels'));
      return reply;
    });
};
