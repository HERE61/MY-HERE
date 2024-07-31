import { Google, Kakao } from 'arctic';

export const kakao = new Kakao(
  process.env.KAKAO_CLIENT_ID,
  process.env.KAKAO_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/login/kakao/callback`
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/login/google/callback`
);
