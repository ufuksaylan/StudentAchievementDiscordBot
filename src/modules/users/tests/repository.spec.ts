import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { userFactory, userMatcher } from './utils';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createUsers = createFor(db, 'users');
const selectUsers = selectAllFor(db, 'users');

afterAll(() => db.destroy());

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('users').execute();
});

describe('create', () => {
  // the same test, but using factory functions that produce fake data
  it('should create an user (with factory functions)', async () => {
    // same as the test above, but using factory functions
    // ACT (When we call...)
    const user = await repository.create(userFactory());

    // ASSERT (Then we should get...)
    expect(user).toEqual(userMatcher());

    // checking directly in the database
    const usersInDatabase = await selectUsers();
    expect(usersInDatabase).toEqual([user]);
  });
});

describe('findAll', () => {
  it('should return all users', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createUsers([
      userFactory({
        userName: 'test1',
      }),
      userFactory({
        userName: 'test4',
      }),
    ]);

    // ACT (When we call...)
    const users = await repository.findAll();

    // ASSERT (Then we should get...)
    expect(users).toHaveLength(2);
    expect(users[0]).toEqual(userMatcher({ userName: 'test1' }));
    expect(users[1]).toEqual(userMatcher({ userName: 'test4' }));
  });
});

describe('findById', () => {
  it('should return an user by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [user] = await createUsers(
      userFactory({
        id: 1371,
      })
    );

    // ACT (When we call...)
    const foundUser = await repository.findById(user!.id);

    // ASSERT (Then we should get...)
    expect(foundUser).toEqual(userMatcher());
  });

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const founduser = await repository.findById(999999);

    // ASSERT (Then we should get...)
    expect(founduser).toBeUndefined();
  });
});

describe('update', () => {
  it('should update an user', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(userFactory());

    // ACT (When we call...)
    const updateduser = await repository.update(user.id, {
      userName: 'test1',
    });

    // ASSERT (Then we should get...)
    expect(updateduser).toMatchObject(
      userMatcher({
        userName: 'test1',
      })
    );
  });

  it('should return the original user if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(userFactory());

    // ACT (When we call...)
    const updateduser = await repository.update(user.id, {});

    // ASSERT (Then we should get...)
    expect(updateduser).toMatchObject(userMatcher());
  });

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const updatedUser = await repository.update(999, {
      userName: 'test1',
    });

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedUser).toBeUndefined();
  });
});

describe('remove', () => {
  it('should remove an user', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(userFactory());

    // ACT (When we call...)
    const removedUser = await repository.remove(user.id);

    // ASSERT (Then we should get...)
    expect(removedUser).toEqual(userMatcher());
  });

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const removedUser = await repository.remove(999);

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedUser).toBeUndefined();
  });
});
