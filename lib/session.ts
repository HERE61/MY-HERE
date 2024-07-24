import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

import { lucia, validateRequest } from './auth';
import { AuthenticationError } from '@/use-cases/errors';

export const setSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return;
  return session.user;
});

export const getSessionId = () => cookies().get(lucia.sessionCookieName)?.value;

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError('사용자가 인증되지 않았습니다');
  }
  // if (!user.emailVerified) {
  //   throw new AuthenticationError('이메일을 인증해야 합니다');
  // }
  return user;
};

export const logout = async () => {
  const sessionId = getSessionId();
  if (!sessionId) return;
  await lucia.invalidateSession(sessionId);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};
