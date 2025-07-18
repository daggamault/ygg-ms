import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text
} from 'drizzle-orm/pg-core';
import { subTenants } from './tenants';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull()
  },
  (table) => [index('email_idx').on(table.email)]
);

export const userSubTenantMaps = pgTable(
  'user_sub_tenant_maps',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    subTenantId: integer('sub_tenant_id')
      .notNull()
      .references(() => subTenants.id),
    role: roleEnum('role').notNull()
  },
  (table) => [
    index('user_sub_tenant_user_id_idx').on(table.userId),
    index('user_sub_tenant_sub_tenant_id_idx').on(table.subTenantId)
  ]
);
