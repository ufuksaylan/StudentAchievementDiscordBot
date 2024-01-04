import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { sprintFactory, sprintMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createsprints = createFor(db, 'sprints');
const selectsprints = selectAllFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('sprints').execute();
});

describe('create', () => {
  // the same test, but using factory functions that produce fake data
  it('should create an sprint (with factory functions)', async () => {
    // same as the test above, but using factory functions
    // ACT (When we call...)
    const sprint = await repository.create(sprintFactory());

    // ASSERT (Then we should get...)
    expect(sprint).toEqual(sprintMatcher());

    // checking directly in the database
    const sprintsInDatabase = await selectsprints();
    expect(sprintsInDatabase).toEqual([sprint]);
  });
});

describe('findAll', () => {
  it('should return all sprints', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createsprints([
      sprintFactory({
        sprintCode: 'wd-1',
        sprintName: 'test1',
      }),
      sprintFactory({
        sprintName: 'test4',
      }),
    ]);

    // ACT (When we call...)
    const sprints = await repository.findAll();

    // ASSERT (Then we should get...)
    expect(sprints).toHaveLength(2);
    expect(sprints[0]).toEqual(
      sprintMatcher({ sprintCode: 'wd-1', sprintName: 'test1' })
    );
    expect(sprints[1]).toEqual(sprintMatcher({ sprintName: 'test4' }));
  });
});

describe('findById', () => {
  it('should return an sprint by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [sprint] = await createsprints(
      sprintFactory({
        id: 1371,
      })
    );

    // ACT (When we call...)
    const foundsprint = await repository.findById(sprint!.id);

    // ASSERT (Then we should get...)
    expect(foundsprint).toEqual(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const foundsprint = await repository.findById(999999);

    // ASSERT (Then we should get...)
    expect(foundsprint).toBeUndefined();
  });
});

describe('update', () => {
  it('should update an sprint', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createsprints(sprintFactory());

    // ACT (When we call...)
    const updatedsprint = await repository.update(sprint.id, {
      sprintName: 'test1',
    });

    // ASSERT (Then we should get...)
    expect(updatedsprint).toMatchObject(
      sprintMatcher({
        sprintName: 'test1',
      })
    );
  });

  it('should return the original sprint if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createsprints(sprintFactory());

    // ACT (When we call...)
    const updatedsprint = await repository.update(sprint.id, {});

    // ASSERT (Then we should get...)
    expect(updatedsprint).toMatchObject(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const updatedsprint = await repository.update(999, {
      sprintName: 'test1',
    });

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedsprint).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an sprint', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createsprints(sprintFactory());

    // ACT (When we call...)
    const removedsprint = await repository.remove(sprint.id);

    // ASSERT (Then we should get...)
    expect(removedsprint).toEqual(sprintMatcher());
  });

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const removedsprint = await repository.remove(999);

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedsprint).toBeUndefined();
  });
});
