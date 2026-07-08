// @ts-check

import i18next from 'i18next';

const singularize = (entity) => {
  if (entity.endsWith('ses')) return entity.slice(0, -2);
  if (entity.endsWith('ies')) return `${entity.slice(0, -3)}y`;
  if (entity.endsWith('s')) return entity.slice(0, -1);
  return entity;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// eslint-disable-next-line import/prefer-default-export
export const createCrudRoutes = (app, {
  model, entityName, entityVar, skipDelete,
}) => {
  const entity = entityName;
  const singular = singularize(entity);
  const Model = model;
  const varName = entityVar || singular;

  app
    .get(`/${entity}`, { name: entity }, async (req, reply) => {
      const items = await Model.query();
      reply.render(`${entity}/index`, { [entity]: items });
      return reply;
    })
    .get(`/${entity}/new`, { name: `new${capitalize(singular)}`, preValidation: app.authenticate }, (req, reply) => {
      const item = new Model();
      reply.render(`${entity}/new`, { [varName]: item });
    })
    .post(`/${entity}`, { preValidation: app.authenticate }, async (req, reply) => {
      const item = new Model();
      item.$set(req.body.data);

      try {
        const validItem = await Model.fromJson(req.body.data);
        await Model.query().insert(validItem);
        req.flash('info', i18next.t(`flash.${entity}.create.success`));
        reply.redirect(app.reverse(entity));
      } catch (err) {
        req.log.error({ err, body: req.body }, `${entity} creation failed`);
        req.flash('error', i18next.t(`flash.${entity}.create.error`));
        reply.render(`${entity}/new`, { [varName]: item, errors: err.data });
      }

      return reply;
    })
    .get(`/${entity}/:id/edit`, { name: `edit${capitalize(singular)}`, preValidation: app.authenticate }, async (req, reply) => {
      const item = await Model.query().findById(req.params.id);
      reply.render(`${entity}/edit`, { [varName]: item });
      return reply;
    })
    .post(`/${entity}/:id`, { name: `update${capitalize(singular)}`, preValidation: app.authenticate }, async (req, reply) => {
      const item = await Model.query().findById(req.params.id);
      try {
        await item.$query().patch(req.body.data);
        req.flash('info', i18next.t(`flash.${entity}.update.success`));
        reply.redirect(app.reverse(entity));
      } catch (err) {
        req.log.error({ err, body: req.body }, `${entity} update failed`);
        req.flash('error', i18next.t(`flash.${entity}.update.error`));
        reply.render(`${entity}/edit`, { [varName]: item, errors: err.data });
      }

      return reply;
    });

  if (!skipDelete) {
    app.post(`/${entity}/:id/delete`, { name: `delete${capitalize(singular)}`, preValidation: app.authenticate }, async (req, reply) => {
      try {
        await Model.query().deleteById(req.params.id);
        req.flash('info', i18next.t(`flash.${entity}.delete.success`));
      } catch (err) {
        req.log.error({ err }, `${entity} delete failed`);
        req.flash('error', i18next.t(`flash.${entity}.delete.error`));
      }

      reply.redirect(app.reverse(entity));
      return reply;
    });
  }
};
