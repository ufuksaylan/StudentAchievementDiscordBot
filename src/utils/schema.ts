import { z } from 'zod';
import Insertable from 'kysely';

// Factory function to create parsers for validating and coercing data
export default function createParsers(
  schema: z.ZodObject<any, any>,
  insertableObject: {} = {},
  updatableObject: {} = {}
) {
  // parsers for validating and coercing data
  const insertable = schema.omit({
    id: true,
    ...insertableObject,
  });
  const updatable = insertable.omit(updatableObject).partial();

  const parseId = (id: unknown) => schema.shape.id.parse(id);
  const parse = (record: unknown) => schema.parse(record);
  const parseInsertable = (record: unknown) => insertable.parse(record);
  const parseUpdatable = (record: unknown) => updatable.parse(record);

  return {
    parseId,
    parse,
    parseInsertable,
    parseUpdatable,
  };
}
