import { eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';

import { db, dbPool } from '@/db';
import { emailVerificationCodeTable } from '@/db/schema';

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
) => {
  await db.query.emailVerificationCodeTable.findFirst({
    where: eq(emailVerificationCodeTable.userId, userId),
  });
  const code = generateRandomString(6, alphabet('0-9'));
  const codeExpiresAt = createDate(new TimeSpan(15, 'm'));
  await db
    .insert(emailVerificationCodeTable)
    .values({ userId, code, expiresAt: codeExpiresAt, email })
    .onConflictDoUpdate({
      target: emailVerificationCodeTable.email,
      set: {
        code,
        expiresAt: codeExpiresAt,
      },
    });
  return code;
};

export const getEmailVerificationCode = async (userId: string) =>
  db.query.emailVerificationCodeTable.findFirst({
    where: eq(emailVerificationCodeTable.userId, userId),
  });

export const verifyEmailVerificationCode = async (
  user: User,
  emailVerificationCode: string
): Promise<boolean> =>
  await dbPool.transaction(async (trx) => {
    const databaseCode = await trx.query.emailVerificationCodeTable.findFirst({
      where: eq(emailVerificationCodeTable.userId, user.id),
    });
    if (!databaseCode || databaseCode.code !== emailVerificationCode) {
      return false;
    }
    await trx
      .delete(emailVerificationCodeTable)
      .where(eq(emailVerificationCodeTable.id, databaseCode.id));
    if (!isWithinExpirationDate(databaseCode.expiresAt)) {
      return false;
    }
    if (databaseCode.email !== user.email) {
      return false;
    }

    return true;
  });

export const deleteEmailVerificationCode = async (userId: string) => {
  await db
    .delete(emailVerificationCodeTable)
    .where(eq(emailVerificationCodeTable.userId, userId));
};
