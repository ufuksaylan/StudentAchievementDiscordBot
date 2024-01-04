import type { Insertable } from 'kysely';
import type { Messages } from '@/database';

/**
 * Generates a fake Message with some default data for inserting it to the database.
 * Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake Message.
 * @returns an Message that can be inserted into the database.
 */
export const messageFactory = (
  overrides?: Partial<Insertable<Messages>>
): Insertable<Messages> => ({
  userId: 1,
  templateId: 1,
  sprintId: 1,
  ...overrides,
});

/**
 * Generates a fake Message with some default data. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article.
 * @returns an article with all fields.
 */

export const messageFactoryFull = (
  overrides: Partial<Insertable<Messages>> = {}
): Messages => ({
  // @ts-ignore
  id: 1,
  // @ts-ignore
  timestamp: 'hello',

  // @ts-ignore
  ...messageFactory(overrides),
});

/**
 * Generates a matcher for an article. Allows overriding properties.
 * @param overrides Any properties that should be different from the default fake article matcher.
 * @returns a matcher that can be used to compare an article from the database.
 */
export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  timestamp: expect.any(String),
  ...overrides, // for id
  ...messageFactory(overrides),
});
