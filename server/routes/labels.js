// @ts-check

import { createCrudRoutes } from './crud.js';

export default (app) => {
  createCrudRoutes(app, {
    model: app.objection.models.label,
    entityName: 'labels',
    entityVar: 'label',
  });
};
