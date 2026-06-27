// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

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
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      firstName: params.firstName,
      lastName: params.lastName,
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('edit', async () => {
    const user = await models.user.query().findOne({
      email: testData.users.existing.email,
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: testData.users.existing },
    });
    const [sessionCookie] = loginResponse.cookies;
    const cookie = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: user.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const user = await models.user.query().findOne({
      email: testData.users.existing.email,
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: testData.users.existing },
    });
    const [sessionCookie] = loginResponse.cookies;
    const cookie = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${user.id}`,
      payload: { data: { firstName: 'Updated', lastName: 'Name', email: user.email } },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedUser = await models.user.query().findById(user.id);
    expect(updatedUser.firstName).toBe('Updated');
    expect(updatedUser.lastName).toBe('Name');
  });

  it('edit forbidden for other user', async () => {
    const user = await models.user.query().findOne({
      email: testData.users.existing.email,
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: testData.users.existing },
    });
    const [sessionCookie] = loginResponse.cookies;
    const cookie = { [sessionCookie.name]: sessionCookie.value };

    const otherUser = await models.user.query()
      .where('email', '!=', user.email)
      .first();

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: otherUser.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
  });

  it('delete own account', async () => {
    const deleteUserData = {
      firstName: 'Delete',
      lastName: 'Me',
      email: 'delete_me@test.com',
      password: 'test123',
    };
    const insertData = {
      firstName: deleteUserData.firstName,
      lastName: deleteUserData.lastName,
      email: deleteUserData.email,
      passwordDigest: encrypt(deleteUserData.password),
    };
    await knex('users').insert(insertData);

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: { email: deleteUserData.email, password: deleteUserData.password } },
    });
    const [sessionCookie] = loginResponse.cookies;
    const cookie = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: deleteUserData.email });

    const response = await app.inject({
      method: 'DELETE',
      url: `/users/${user.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedUser = await models.user.query().findById(user.id);
    expect(deletedUser).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
