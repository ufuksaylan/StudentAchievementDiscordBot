import type { Insertable } from 'kysely';
import type { Users } from '@/database';

/**
 * Generates a fake user with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake user.
 * @returns an user that can be inserted into the database.
 */
export const userFactory = (
  overrides?: Partial<Insertable<Users>>
): Insertable<Users> => ({
  userName: 'JohnDoe',
  ...overrides,
});

/**
 * Generates a fake user with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */

export const userFactoryFull = (
  overrides: Partial<Insertable<Users>> = {}
): Users => ({
  // @ts-ignore
  id: 1,
  ...userFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const userMatcher = (overrides: Partial<Insertable<Users>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...userFactory(overrides),
});
