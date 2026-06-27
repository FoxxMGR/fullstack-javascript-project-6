// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, async (req, reply) => {
      if (req.body?._method === 'DELETE') {
        req.logOut();
        req.flash('info', i18next.t('flash.session.delete.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      const authenticate = app.fp.authenticate('form', async (req2, reply2, err, user) => {
        if (err) {
          return app.httpErrors.internalServerError(err);
        }
        if (!user) {
          const signInForm = req2.body.data;
          const errors = {
            email: [{ message: i18next.t('flash.session.create.error') }],
          };
          reply2.render('session/new', { signInForm, errors });
          return reply2;
        }
        await req2.logIn(user);
        req2.flash('success', i18next.t('flash.session.create.success'));
        reply2.redirect(app.reverse('root'));
        return reply2;
      });

      return authenticate(req, reply);
    })
    .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
