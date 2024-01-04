import { z } from 'zod';
import type { Users } from '@/database';

// validation schema
type Record = Users;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  userName: z.string().min(2).max(32),
});

// schema version for inserting new records
const insertable = schema.omit({
  id: true,
});

// schema version for updating existing records
const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdatable = (record: unknown) => updateable.parse(record);

// matches database and validation schema keys
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
