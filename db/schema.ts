import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('accountType', ['oauth', 'credentials']);
export const providerEnum = pgEnum('provider', ['google']);

export const usersTable = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerifiedAt: timestamp('email_verified_at', {
    withTimezone: true,
    mode: 'date',
  }),
});

export const sessionsTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_name')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const accountsTable = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  password: text('password'),
  accountType: accountTypeEnum('accountType').notNull(),
  provider: providerEnum('provider'),
  providerAccountId: varchar('provider_account_id', { length: 255 }),
});

export const resetTokensTable = pgTable('reset_tokens', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const emailVerificationCodeTable = pgTable('email_verification_code', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  email: text('email')
    .references(() => usersTable.email)
    .unique(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  place: varchar('place', { length: 255 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  productImage1: text('product_image_1').default(''),
  productImage2: text('product_image_2').default(''),
  productImage3: text('product_image_3').default(''),
});
