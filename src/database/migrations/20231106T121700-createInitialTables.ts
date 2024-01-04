import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_name', 'text', (column) => column.notNull().unique())
    .execute();

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('message_template', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('sprint_code', 'text', (column) => column.notNull().unique())
    .addColumn('sprint_name', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (column) =>
      column.references('users.id').notNull()
    )
    .addColumn('template_id', 'integer', (column) =>
      column.references('templates.id').notNull()
    )
    .addColumn('sprint_id', 'integer', (column) =>
      column.references('sprints.id').notNull()
    )
    .addColumn('timestamp', 'datetime', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('messages').execute();
  await db.schema.dropTable('sprints').execute();
  await db.schema.dropTable('templates').execute();
  await db.schema.dropTable('users').execute();
}
