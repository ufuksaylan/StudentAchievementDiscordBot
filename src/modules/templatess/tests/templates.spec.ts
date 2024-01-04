import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { selectAllFor } from '@tests/utils/records';
import createApp from '@/app';
import { createFor } from '@tests/utils/records';
import { templateFactory, templateMatcher } from './utils';
import { omit } from 'lodash/fp';

const db = await createTestDatabase();
const app = createApp(db);
const selectTemplates = selectAllFor(db, 'templates');

const createTemplates = createFor(db, 'templates');

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

describe('GET', () => {
  it('should return an empty array when there are no articles', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app).get('/templates').expect(200);

    // ASSERT (Then we should get...)
    expect(body).toEqual([]);
  });

  it('should return a list of existing articles', async () => {
    // ARRANGE (Given that we have...)
    await createTemplates([
      templateFactory(),

      templateFactory({
        messageTemplate: 'testmessageTemplate2',
      }),
    ]);

    // ACT (When we request...)
    const { body } = await supertest(app).get('/templates').expect(200);

    // ASSERT (Then we should get...)
    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({
        messageTemplate: 'testmessageTemplate2',
      }),
    ]);
  });
});

describe('POST', () => {
  it('should allow creating a new template', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(templateFactory())
      .expect(201);

    expect(body).toEqual(templateMatcher());
  });

  it('persists the new template', async () => {
    await supertest(app).post('/templates').send(templateFactory()).expect(201);

    await expect(selectTemplates()).resolves.toEqual([templateMatcher()]);
  });

  it('should ignore the provided id', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send({
        ...templateFactory(),
        id: 123456,
      });

    expect(body.id).not.toEqual(123456);
  });

  it('should return 400 if messageTemplate is missing', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['messageTemplate'], templateFactory({})))
      .expect(400); // a cheeky convenient expectation inside of ACT

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/messageTemplate/i);
  });

  it('does not allow to create an template with an empty messageTemplate', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app)
      .post('/templates')
      .send(templateFactory({ messageTemplate: '' }))
      .expect(400);

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/messageTemplate/i);
  });
});

describe('GET', () => {
  it('should return 404 if template does not exist', async () => {
    const { body } = await supertest(app).get('/templates/2912').expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return the template', async () => {
    await createTemplates([
      templateFactory({
        id: 1371,
      }),
    ]);

    // ACT (When we request...)
    const { body } = await supertest(app).get('/templates/1371').expect(200);

    // ASSERT (Then we expect...)
    expect(body).toEqual(
      templateMatcher({
        id: 1371,
      })
    );
  });
});

describe('PATCH /:id', () => {
  it('returns 404 if article does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/templates/123456')
      .send(templateFactory())
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('allows partial updates', async () => {
    await createTemplates([
      templateFactory({
        id: 137234,
      }),
    ]);

    const { body } = await supertest(app)
      .patch(`/templates/${137234}`)
      .send({ messageTemplate: 'Updated!' })
      .expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 137234,
        messageTemplate: 'Updated!',
      })
    );
  });

  it('persists changes', async () => {
    const id = 41512;
    await createTemplates([templateFactory({ id })]);

    await supertest(app)
      .patch(`/templates/${id}`)
      .send({ messageTemplate: 'Persisted!' })
      .expect(200);

    const { body } = await supertest(app).get('/templates/41512').expect(200);

    expect(body).toEqual(
      templateMatcher({
        id,
        messageTemplate: 'Persisted!',
      })
    );
  });
});

// ...

describe('DELETE /:id', () => {
  it('deletes an existing template', async () => {
    // Create a template to be deleted
    const template = await createTemplates([
      templateFactory({
        id: 123456,
      }),
    ]);

    // Send a DELETE request to delete the template
    const response = await supertest(app)
      .delete(`/templates/123456`)
      .expect(204);
  });

  it('returns 404 if template does not exist', async () => {
    const nonExistenttemplateId = 123456;

    // Send a DELETE request to delete a non-existent template
    const response = await supertest(app)
      .delete(`/templates/${nonExistenttemplateId}`)
      .expect(404);

    // Verify that the response contains the appropriate error message
    expect(response.body.error.message).toMatch(/not found/i);
  });
});

describe('PUT /:id', () => {
  it('doesnt accept partial updates', async () => {
    await createTemplates([
      templateFactory({
        id: 123456,
      }),
    ]);

    const { body } = await supertest(app)
      .put('/templates/123456')
      .send({ messageTemplate: 'Updated!' })
      .expect(400);

    expect(body.error.message).toMatch(/id/i);
  });

  it('updates or creates a template', async () => {
    await createTemplates([
      templateFactory({
        id: 123456,
        messageTemplate: 'Original!',
      }),
    ]);

    const { body } = await supertest(app)
      .put('/templates/123456')
      .send(templateFactory({ id: 2, messageTemplate: 'Updated!' }))
      .expect(200);

    expect(body).toEqual(
      templateMatcher({
        id: 2,
        messageTemplate: 'Updated!',
      })
    );
  });
});
