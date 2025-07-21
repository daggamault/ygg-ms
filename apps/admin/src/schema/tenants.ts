import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull()
  },
  (table) => [index('tenant_name_idx').on(table.name)]
);

export const subTenants = pgTable(
  'sub_tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    name: text('name').notNull()
  },
  (table) => [
    index('sub_tenant_name_idx').on(table.name),
    index('sub_tenant_tenant_id_idx').on(table.tenantId)
  ]
);
