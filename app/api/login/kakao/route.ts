import { generateState } from 'arctic';
import { cookies } from 'next/headers';

import { kakao } from '@/lib/auth/oauth';

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await kakao.createAuthorizationURL(state);

  cookies().set('kakao_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production', // set to false in localhost
    sameSite: 'lax',
    maxAge: 60 * 10,
    httpOnly: true,
  });
  return Response.redirect(url);
}
