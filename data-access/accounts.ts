import { eq } from 'drizzle-orm';

import { hashPassword } from '@/lib/auth';

import { db } from '@/db';
import { accountsTable } from '@/db/schema';
import type { InsertAccount } from '@/db/types';

export const createAccount = async (
  userId: InsertAccount['userId'],
  plainTextPassword: string
) => {
  const passwordHash = await hashPassword(plainTextPassword);
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      accountType: 'credentials',
      password: passwordHash,
    })
    .returning();
  return account;
};

export const changePassword = async (
  plaintTextPassword: string,
  userId: InsertAccount['userId']
) =>
  db
    .update(accountsTable)
    .set({
      password: await hashPassword(plaintTextPassword),
    })
    .where(eq(accountsTable.userId, userId));

export const createAccountViaGoogle = async (userId: string) => {
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      accountType: 'oauth',
      provider: 'google',
    })
    .returning();
  return account;
};

export const getAccountByUserId = async (userId: InsertAccount['userId']) =>
  db.query.accountsTable.findFirst({
    where: eq(accountsTable.userId, userId),
  });
