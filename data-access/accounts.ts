import { eq } from 'drizzle-orm';

import { hashPassword } from '@/lib/auth/credentials';

import { db } from '@/db';
import { accountsTable } from '@/db/schema';
import type { InsertAccount } from '@/db/types';

export const createAccount = async (
  userId: InsertAccount['userId'],
  password: string
) => {
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      password,
    })
    .returning();
  return account;
};

export const updateAccount = async (
  userId: InsertAccount['userId'],
  updatedUser: Partial<Omit<InsertAccount, 'userId'>>
) => {
  db.update(accountsTable)
    .set(updatedUser)
    .where(eq(accountsTable.userId, userId));
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

export const getAccountByUserId = async (userId: InsertAccount['userId']) =>
  db.query.accountsTable.findFirst({
    where: eq(accountsTable.userId, userId),
  });

export const integrateAccountViaOauth = async ({
  userId,
  provider,
  oauthId,
}: {
  userId: InsertAccount['userId'];
  provider: 'kakao' | 'google';
  oauthId: string;
}) => {
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      [`${provider}ProviderId`]: oauthId,
    })
    .returning();
  return account;
};

export const createAccountViaOauth = async ({
  userId,
  provider,
  oauthId,
}: {
  userId: InsertAccount['userId'];
  provider: 'kakao' | 'google';
  oauthId: string;
}) => {
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      [`${provider}ProviderId`]: oauthId,
    })
    .returning();
  return account;
};

export const getAccountByOauthId = async (
  provider: 'kakao' | 'google',
  oauthId: string
) =>
  db.query.accountsTable.findFirst({
    where: eq(accountsTable[`${provider}ProviderId`], oauthId),
  });
