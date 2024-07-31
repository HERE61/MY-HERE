import { OAuth2RequestError } from 'arctic';
import { cookies } from 'next/headers';

import { google } from '@/lib/auth/oauth';
import { setSession } from '@/lib/session';

import { OICD_GOOGLE_URL } from '@/constants/api';
import { signInViaOauthUseCase } from '@/use-cases/user';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('state')?.value ?? null;
  const storedCodeVerifier = cookies().get('code_verifier')?.value ?? null;
  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const googleUserResponse = await fetch(`${OICD_GOOGLE_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const googleUser: GoogleUser = await googleUserResponse.json();

    const userId = await signInViaOauthUseCase({
      email: googleUser.email,
      provider: 'google',
      providerId: googleUser.sub,
    });
    setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    console.error('------google oauth callback error------', e);
    if (e instanceof OAuth2RequestError) {
      //invalid code(code from google authorization)
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}
