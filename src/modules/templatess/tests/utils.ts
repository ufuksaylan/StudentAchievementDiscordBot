import type { Insertable } from 'kysely';
import type { Templates } from '@/database';

/**
 * Generates a fake Template with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake Template.
 * @returns an Template that can be inserted into the database.
 */
export const templateFactory = (
  overrides?: Partial<Insertable<Templates>>
): Insertable<Templates> => ({
  messageTemplate: 'good job !',
  ...overrides,
});

/**
 * Generates a fake Template with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */

export const templateFactoryFull = (
  overrides: Partial<Insertable<Templates>> = {}
): Templates => ({
  // @ts-ignore
  id: 1,
  ...templateFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const templateMatcher = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...templateFactory(overrides),
});
