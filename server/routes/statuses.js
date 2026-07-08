// @ts-check

import i18next from 'i18next';
import { createCrudRoutes } from './crud.js';

export default (app) => {
  createCrudRoutes(app, {
    model: app.objection.models.taskStatus,
    entityName: 'statuses',
    entityVar: 'status',
    skipDelete: true,
  });

  app
    .post('/statuses/:id/delete', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      try {
        const status = await app.objection.models.taskStatus.query()
          .findById(req.params.id);
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
