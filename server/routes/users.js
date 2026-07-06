// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'User creation failed');
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: err.data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users/:id', { name: 'updateUser', preValidation: app.authenticate }, async (req, reply) => {
      const user = await app.objection.models.user.query().findById(req.params.id);
      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('users'));
      } catch (err) {
        req.log.error({ err, body: req.body }, 'User update failed');
        reply.render('users/edit', { user, errors: err.data });
      }

      return reply;
    })
    .post('/users/:id/delete', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      try {
        await app.objection.models.user.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (err) {
        req.log.error({ err }, 'User delete failed');
      }

      reply.redirect(app.reverse('users'));
      return reply;
    });
};
