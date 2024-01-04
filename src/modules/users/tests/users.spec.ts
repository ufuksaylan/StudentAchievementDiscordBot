import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { selectAllFor } from '@tests/utils/records';
import createApp from '@/app';
import { createFor } from '@tests/utils/records';
import { userFactory, userMatcher } from './utils';
import { omit } from 'lodash/fp';

const db = await createTestDatabase();
const app = createApp(db);
const selectUsers = selectAllFor(db, 'users');

const createUsers = createFor(db, 'users');

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('GET', () => {
  it('should return an empty array when there are no articles', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app).get('/users').expect(200);

    // ASSERT (Then we should get...)
    expect(body).toEqual([]);
  });

  it('should return a list of existing articles', async () => {
    // ARRANGE (Given that we have...)
    await createUsers([
      userFactory(),

      userFactory({
        userName: 'testUsername2',
      }),
    ]);

    // ACT (When we request...)
    const { body } = await supertest(app).get('/users').expect(200);

    // ASSERT (Then we should get...)
    expect(body).toEqual([
      userMatcher(),
      userMatcher({
        userName: 'testUsername2',
      }),
    ]);
  });
});

describe('POST', () => {
  it('should allow creating a new user', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send(userFactory())
      .expect(201);

    expect(body).toEqual(userMatcher());
  });

  it('persists the new user', async () => {
    await supertest(app).post('/users').send(userFactory()).expect(201);

    await expect(selectUsers()).resolves.toEqual([userMatcher()]);
  });

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/users')
      .send({
        ...userFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });

  it('should return 400 if username is missing', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/users')
      .send(omit(['userName'], userFactory({})))
      .expect(400); // a cheeky convenient expectation inside of ACT

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/userName/i);
  });

  it('does not allow to create an user with an empty userName', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/users')
      .send(userFactory({ userName: '' }))
      .expect(400);

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/userName/i);
  });
});

describe('GET', () => {
  it('should return 404 if user does not exist', async () => {
    const { body } = await supertest(app).get('/users/2912').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return the user', async () => {
    await createUsers([
      userFactory({
        id: 1371,
      }),
    ]);

    // ACT (When we request...)
    const { body } = await supertest(app).get('/users/1371').expect(200);

    // ASSERT (Then we expect...)
    expect(body).toEqual(
      userMatcher({
        id: 1371,
      })
    );
  });
});

describe('PATCH /:id', () => {
  it('returns 404 if article does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/users/123456')
      .send(userFactory())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('allows partial updates', async () => {
    await createUsers([
      userFactory({
        id: 137234,
      }),
    ]);

    const { body } = await supertest(app)
      .patch(`/users/${137234}`)
      .send({ username: 'Updated!' })
      .expect(200);

    expect(body).toEqual(
      userMatcher({
        id: 137234,
      })
    );
  });

  it('persists changes', async () => {
    const id = 41512;
    await createUsers([userFactory({ id })]);

    await supertest(app)
      .patch(`/users/${id}`)
      .send({ userName: 'Persisted!' })
      .expect(200);

    const { body } = await supertest(app).get('/users/41512').expect(200);

    expect(body).toEqual(
      userMatcher({
        id,
        userName: 'Persisted!',
      })
    );
  });
});

// ...

describe('DELETE /:id', () => {
  it('deletes an existing user', async () => {
    // Create a user to be deleted
    const user = await createUsers([
      userFactory({
        id: 123456,
      }),
    ]);

    // Send a DELETE request to delete the user
    const response = await supertest(app).delete(`/users/123456`).expect(204);
  });

  it('returns 404 if user does not exist', async () => {
    const nonExistentUserId = 123456;

    // Send a DELETE request to delete a non-existent user
    const response = await supertest(app)
      .delete(`/users/${nonExistentUserId}`)
      .expect(404);

    // Verify that the response contains the appropriate error message
    expect(response.body.error.message).toMatch(/not found/i);
  });
});

describe('PUT /:id', () => {
  it('doesnt accept partial updates', async () => {
    await createUsers([
      userFactory({
        id: 123456,
      }),
    ]);

    const { body } = await supertest(app)
      .put('/users/123456')
      .send({ userName: 'Updated!' })
      .expect(400);

    expect(body.error.message).toMatch(/id/i);
  });

  it('updates or creates a user', async () => {
    await createUsers([
      userFactory({
        id: 123456,
        userName: 'Original!',
      }),
    ]);

    const { body } = await supertest(app)
      .put('/users/123456')
      .send(userFactory({ id: 2, userName: 'Updated!' }))
      .expect(200);

    expect(body).toEqual(
      userMatcher({
        id: 2,
        userName: 'Updated!',
      })
    );
  });
});
