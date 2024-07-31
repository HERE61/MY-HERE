import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';

import { google } from '@/lib/auth/oauth';

export async function GET(): Promise<Response> {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ['profile', 'email'],
    });
    cookies().set('state', state, {
      secure: process.env.NODE_ENV === 'production', // set to false in localhost
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 min
    });

    // store code verifier as cookie
    cookies().set('code_verifier', codeVerifier, {
      secure: process.env.NODE_ENV === 'production', // set to false in localhost
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10, // 10 min
    });
    return Response.redirect(url);
  } catch (e) {
    console.error('------google oauth authorization error------', e);
    return new Response(null, {
      status: 500,
    });
  }
}
