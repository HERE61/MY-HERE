import { OAuth2RequestError } from 'arctic';
import { cookies } from 'next/headers';

import { kakao } from '@/lib/auth/oauth';
import { setSession } from '@/lib/session';

import { KAKAO_API_URL } from '@/constants/api';
import { signInViaOauthUseCase } from '@/use-cases/user';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('kakao_oauth_state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await kakao.validateAuthorizationCode(code);
    const kakaoUserResponse = await fetch(`${KAKAO_API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const kakaoUser: KakaoUser = await kakaoUserResponse.json();

    const userId = await signInViaOauthUseCase({
      email: kakaoUser.kakao_account.email,
      provider: 'kakao',
      providerId: String(kakaoUser.id),
    });
    setSession(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    console.error('------kakao oauth callback error------', e);
    if (e instanceof OAuth2RequestError) {
      //invalid code(code from kakao authorization)
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface KakaoUserProperties {
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
}

interface KakaoProfile {
  nickname: string;
  thumbnail_image_url: string;
  profile_image_url: string;
  is_default_image: boolean;
  is_default_nickname: boolean;
}

interface KakaoAccount {
  profile_nickname_needs_agreement: boolean;
  profile_image_needs_agreement: boolean;
  profile: KakaoProfile;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
}

interface KakaoUser {
  id: number;
  connected_at: string;
  properties: KakaoUserProperties;
  kakao_account: KakaoAccount;
}
