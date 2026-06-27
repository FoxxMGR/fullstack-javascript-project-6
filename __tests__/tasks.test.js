// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();
  let cookie;
  let userId;
  let statusId;
  let taskId;

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

    const user = await models.user.query().findOne({ email: testData.users.existing.email });
    userId = user.id;

    const status = await models.taskStatus.query().insert({ name: 'Test Status' });
    statusId = status.id;

    const task = await models.task.query().insert({
      name: 'Test Task',
      description: 'Test Description',
      statusId,
      creatorId: userId,
      executorId: userId,
    });
    taskId = task.id;
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('filter by status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('tasks')}?statusId=${statusId}`,
    });

    expect(response.statusCode).toBe(200);
  });

  it('filter by executor', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('tasks')}?executorId=${userId}`,
    });

    expect(response.statusCode).toBe(200);
  });

  it('filter by my tasks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${app.reverse('tasks')}?isCreatorUser=on`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new without auth', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });

    expect(response.statusCode).toBe(302);
  });

  it('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: {
          name: 'New Test Task',
          description: 'New Test Description',
          statusId,
          executorId: userId,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: 'New Test Task' });
    expect(task).toBeDefined();
    expect(task.name).toBe('New Test Task');
    expect(task.creatorId).toBe(userId);
  });

  it('show', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('showTask', { id: taskId }),
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}`,
      payload: {
        data: {
          name: 'Updated Task',
          description: 'Updated Description',
          statusId,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedTask = await models.task.query().findById(taskId);
    expect(updatedTask.name).toBe('Updated Task');
  });

  it('delete', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${taskId}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedTask = await models.task.query().findById(taskId);
    expect(deletedTask).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
