// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
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
      url: app.reverse('statuses'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new without auth', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
    });

    expect(response.statusCode).toBe(302);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      payload: { data: { name: 'New Status' } },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.taskStatus.query().findOne({ name: 'New Status' });
    expect(status).toBeDefined();
    expect(status.name).toBe('New Status');
  });

  it('update', async () => {
    const status = await models.taskStatus.query().findOne({ name: 'New Status' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/statuses/${status.id}`,
      payload: { data: { name: 'Updated Status' } },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedStatus = await models.taskStatus.query().findById(status.id);
    expect(updatedStatus.name).toBe('Updated Status');
  });

  it('delete', async () => {
    const status = await models.taskStatus.query().findOne({ name: 'Updated Status' });

    const response = await app.inject({
      method: 'DELETE',
      url: `/statuses/${status.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedStatus = await models.taskStatus.query().findById(status.id);
    expect(deletedStatus).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
