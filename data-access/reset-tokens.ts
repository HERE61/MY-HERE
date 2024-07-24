import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { TimeSpan, createDate } from 'oslo';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';

import { db } from '@/db';
import { resetTokensTable } from '@/db/schema';
import type { InsertResetToken, InsertUser } from '@/db/types';

export const generatePasswordResetToken = async (userId: InsertUser['id']) => {
  await db.delete(resetTokensTable).where(eq(resetTokensTable.userId, userId));
  const tokenId = generateIdFromEntropySize(25);
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  const tokenExpiresAt = createDate(new TimeSpan(2, 'h'));

  await db
    .insert(resetTokensTable)
    .values({
      userId,
      token: tokenHash,
      expiresAt: tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokensTable.id,
      set: {
        token: tokenHash,
        expiresAt: tokenExpiresAt,
      },
    });
  return tokenId;
};

export const getPasswordResetToken = async (token: string) => {
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
  return db.query.resetTokensTable.findFirst({
    where: eq(resetTokensTable.token, tokenHash),
  });
};

export const deletePasswordResetToken = async (
  token: InsertResetToken['token']
) => db.delete(resetTokensTable).where(eq(resetTokensTable.token, token));
