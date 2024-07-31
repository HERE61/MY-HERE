import { type User, generateIdFromEntropySize } from 'lucia';
import { isWithinExpirationDate } from 'oslo';

import { lucia } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/auth/credentials';
import { sendEmail } from '@/lib/email';

import ResetPasswordEmailTemplate from '@/components/email/reset-password';
import { EmailVerificationTemplate } from '@/components/email/verify-email';

import {
  createAccountViaOauth,
  getAccountByOauthId,
  updateAccount,
} from './../data-access/accounts';
import { AuthenticationError, DuplicateError, NotFoundError } from './errors';
import {
  changePassword,
  createAccount,
  getAccountByUserId,
} from '@/data-access/accounts';
import {
  deletePasswordResetToken,
  generatePasswordResetToken,
  getPasswordResetToken,
} from '@/data-access/reset-tokens';
import { createUser, getUserByEmail, updateUser } from '@/data-access/users';
import {
  deleteEmailVerificationCode,
  generateEmailVerificationCode,
  verifyEmailVerificationCode,
} from '@/data-access/verify-email';

export const registerUserUseCase = async (email: string, password: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new DuplicateError('해당 이메일로 가입한 사용자가 이미 존재합니다.');
  }
  const userId = generateIdFromEntropySize(10);
  const user = await createUser(userId, email);
  const passwordHash = await hashPassword(password);
  await createAccount(user.id, passwordHash);

  // const config: Config = {
  //   dictionaries: [colors, animals],
  //   separator: " ",
  //   style: "capital",
  // };

  // const displayName = uniqueNamesGenerator(config);
  // await createProfile(user.id, displayName);

  const code = await generateEmailVerificationCode(user.id, email);
  await sendEmail({
    email,
    subject: '이메일 주소를 인증해주세요',
    body: EmailVerificationTemplate({ code }),
  });

  return { id: user.id };
};

export const verifyUserUseCase = async (
  email: string,
  plainTextPassword: string
) => {
  const user = await getUserByEmail(email);
  if (!user) return false;
  const account = await getAccountByUserId(user.id);
  if (!account) return false;

  return {
    user,
    isVerified: await verifyPassword(
      plainTextPassword,
      account.password as string
    ),
  };
};

export async function loginUseCase(email: string, password: string) {
  const verifiedUser = await verifyUserUseCase(email, password);

  if (!verifiedUser || !verifiedUser.isVerified) {
    throw new AuthenticationError(
      '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.'
    );
  }

  return { id: verifiedUser.user.id };
}

export const resetPasswordUseCase = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundError('해당 이메일로 가입한 계정을 찾지 못하였습니다.');
  }
  const token = await generatePasswordResetToken(user.id);

  await sendEmail({
    email,
    subject: `HERE 비밀번호 초기화 안내에 대한 링크입니다`,
    body: ResetPasswordEmailTemplate({ token }),
  });
};

export const verifyPasswordResetTokenUseCase = async (
  password: string,
  token: string
) => {
  const passwordResetTokenData = await getPasswordResetToken(token);
  if (passwordResetTokenData) {
    deletePasswordResetToken(passwordResetTokenData.token);
  }
  const isValidToken =
    passwordResetTokenData &&
    passwordResetTokenData.token &&
    isWithinExpirationDate(passwordResetTokenData.expiresAt);
  if (!isValidToken) {
    throw new AuthenticationError('패스워드 재설정을 할 권한이 없습니다.');
  }
  await lucia.invalidateUserSessions(passwordResetTokenData.userId);
  await changePassword(password, passwordResetTokenData.userId);
  return passwordResetTokenData.userId;
};

export const verifyEmailUseCase = async (user: User, code: string) => {
  const validCode = await verifyEmailVerificationCode(user, code);
  if (!validCode) {
    throw new AuthenticationError(
      '잘못된 코드입니다. 올바른 코드를 입력해주세요.'
    );
  }
  await lucia.invalidateUserSessions(user.id);
  await updateUser(user.id, {
    emailVerifiedAt: new Date(),
  });
  await deleteEmailVerificationCode(user.id);
};

export const resendVerificationEmailUseCase = async (user: User) => {
  if (user.emailVerified) {
    throw new DuplicateError('이미 인증된 메일입니다.');
  }
  const code = await generateEmailVerificationCode(user.id, user.email);
  await sendEmail({
    email: user.email,
    subject: '이메일 주소를 인증해주세요',
    body: EmailVerificationTemplate({ code }),
  });
};

export const signInViaOauthUseCase = async ({
  email,
  provider,
  providerId,
}: {
  email: string | null;
  provider: 'google' | 'kakao';
  providerId: string;
}) => {
  if (!email) {
    throw new AuthenticationError('카카오 계정에 이메일을 등록해주세요');
  }
  const existingUser = await getUserByEmail(email);
  // 해당 이메일로 사용자가 존재하는 경우
  if (existingUser) {
    const hasSignedUpViaOauth = await getAccountByOauthId(provider, providerId);
    if (!hasSignedUpViaOauth) {
      // 이메일로 가입한 이력이 있지만 소셜로그인이 처음이면 providerId set
      await updateAccount(existingUser.id, {
        [`${provider}ProviderId`]: providerId,
      });
    }
    await updateUser(existingUser.id, {
      lastLoginAt: new Date(),
    });
    return existingUser.id;
  }
  // 해당 이메일로 사용자가 없는 경우 oauth 가입 진행
  const userId = generateIdFromEntropySize(10);
  await createUser(userId, email);
  const newAccount = await createAccountViaOauth({
    userId,
    provider,
    oauthId: providerId,
  });
  return newAccount.userId;
};
