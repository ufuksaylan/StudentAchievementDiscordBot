import type { Insertable } from 'kysely';
import type { Sprints } from '@/database';

/**
 * Generates a fake Sprint with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake Sprint.
 * @returns an Sprint that can be inserted into the database.
 */
export const sprintFactory = (
  overrides?: Partial<Insertable<Sprints>>
): Insertable<Sprints> => ({
  sprintCode: 'test',
  sprintName: 'test',
  ...overrides,
});

/**
 * Generates a fake Sprint with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */

export const sprintFactoryFull = (
  overrides: Partial<Insertable<Sprints>> = {}
): Sprints => ({
  // @ts-ignore
  id: 1,
  ...sprintFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const sprintMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...sprintFactory(overrides),
});
