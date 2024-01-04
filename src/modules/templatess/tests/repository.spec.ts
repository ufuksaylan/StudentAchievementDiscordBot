import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { templateFactory, templateMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createTemplates = createFor(db, 'templates');
const selectTemplates = selectAllFor(db, 'templates');

afterAll(() => db.destroy());

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('templates').execute();
});

describe('create', () => {
  // the same test, but using factory functions that produce fake data
  it('should create an template (with factory functions)', async () => {
    // same as the test above, but using factory functions
    // ACT (When we call...)
    const template = await repository.create(templateFactory());

    // ASSERT (Then we should get...)
    expect(template).toEqual(templateMatcher());

    // checking directly in the database
    const templatesInDatabase = await selectTemplates();
    expect(templatesInDatabase).toEqual([template]);
  });
});

describe('findAll', () => {
  it('should return all templates', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createTemplates([
      templateFactory({
        messageTemplate: 'good job!',
      }),
      templateFactory({
        messageTemplate: 'test4',
      }),
    ]);

    // ACT (When we call...)
    const templates = await repository.findAll();

    // ASSERT (Then we should get...)
    expect(templates).toHaveLength(2);
    expect(templates[0]).toEqual(
      templateMatcher({ messageTemplate: 'good job!' })
    );
    expect(templates[1]).toEqual(templateMatcher({ messageTemplate: 'test4' }));
  });
});

describe('findById', () => {
  it('should return an template by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [template] = await createTemplates(
      templateFactory({
        id: 1371,
      })
    );

    // ACT (When we call...)
    const foundtemplate = await repository.findById(template!.id);

    // ASSERT (Then we should get...)
    expect(foundtemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const foundtemplate = await repository.findById(999999);

    // ASSERT (Then we should get...)
    expect(foundtemplate).toBeUndefined();
  });
});

describe('update', () => {
  it('should update an template', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(templateFactory());

    // ACT (When we call...)
    const updatedtemplate = await repository.update(template.id, {
      messageTemplate: 'good job!',
    });

    // ASSERT (Then we should get...)
    expect(updatedtemplate).toMatchObject(
      templateMatcher({
        messageTemplate: 'good job!',
      })
    );
  });

  it('should return the original template if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(templateFactory());

    // ACT (When we call...)
    const updatedtemplate = await repository.update(template.id, {});

    // ASSERT (Then we should get...)
    expect(updatedtemplate).toMatchObject(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const updatedtemplate = await repository.update(999, {
      messageTemplate: 'hello world',
    });

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedtemplate).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an template', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(templateFactory());

    // ACT (When we call...)
    const removedtemplate = await repository.remove(template.id);

    // ASSERT (Then we should get...)
    expect(removedtemplate).toEqual(templateMatcher());
  });

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const removedtemplate = await repository.remove(999);

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedtemplate).toBeUndefined();
  });
});
