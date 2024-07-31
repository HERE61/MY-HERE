import { eq } from 'drizzle-orm';
import { type User } from 'lucia';

import { usersTable } from './../db/schema';
import { db } from '@/db';
import type { InsertUser } from '@/db/types';

export const createUser = async (
  id: InsertUser['id'],
  email: InsertUser['email']
) => {
  const [user] = await db.insert(usersTable).values({ id, email }).returning();
  return user;
};

export async function updateUser(
  userId: User['id'],
  updatedUser: Partial<Omit<InsertUser, 'id'>>
) {
  await db.update(usersTable).set(updatedUser).where(eq(usersTable.id, userId));
}

export const getUserByEmail = async (email: InsertUser['email']) =>
  db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });
