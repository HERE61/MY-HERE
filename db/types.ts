import type {
  accountsTable,
  emailVerificationCodeTable,
  productsTable,
  resetTokensTable,
  sessionsTable,
  usersTable,
} from './schema';

export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = typeof productsTable.$inferSelect;

export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;

export type InsertResetToken = typeof resetTokensTable.$inferInsert;
export type SelectResetToken = typeof resetTokensTable.$inferSelect;

export type InsertEmailVerificationCode =
  typeof emailVerificationCodeTable.$inferInsert;
export type SelectEmailVerificationCode =
  typeof emailVerificationCodeTable.$inferSelect;
