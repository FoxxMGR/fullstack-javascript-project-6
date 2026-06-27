// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();
  let cookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    await prepareData(app);

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: testData.users.existing },
    });
    const [sessionCookie] = loginResponse.cookies;
    cookie = { [sessionCookie.name]: sessionCookie.value };
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new without auth', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
    });

    expect(response.statusCode).toBe(302);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: { data: { name: 'Bug' } },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const label = await models.label.query().findOne({ name: 'Bug' });
    expect(label).toBeDefined();
    expect(label.name).toBe('Bug');
  });

  it('update', async () => {
    const label = await models.label.query().findOne({ name: 'Bug' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: { data: { name: 'Feature' } },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedLabel = await models.label.query().findById(label.id);
    expect(updatedLabel.name).toBe('Feature');
  });

  it('delete', async () => {
    const label = await models.label.query().findOne({ name: 'Feature' });

    const response = await app.inject({
      method: 'DELETE',
      url: `/labels/${label.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedLabel = await models.label.query().findById(label.id);
    expect(deletedLabel).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
