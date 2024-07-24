import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';

import { lucia, verifyPassword } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

import ResetPasswordEmailTemplate from '@/components/email/reset-password';
import { EmailVerificationTemplate } from '@/components/email/verify-email';

import {
  AuthenticationError,
  DuplicateError,
  LoginError,
  NotFoundError,
} from './errors';
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
    throw new DuplicateError('해당 이메일을 가진 사용자가 이미 존재합니다.');
  }
  const user = await createUser(email);
  await createAccount(user.id, password);

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
    throw new LoginError();
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
    throw new AuthenticationError('패스워드 재설정을 할 권한이 없습니다');
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
    emailVerified: true,
    emailVerifiedAt: new Date(),
  });
  await deleteEmailVerificationCode(user.id);
};

export const resendVerificationEmailUseCase = async (user: User) => {
  if (user.emailVerified) {
    throw new DuplicateError('이미 인증된 메일입니다');
  }
  const code = await generateEmailVerificationCode(user.id, user.email);
  await sendEmail({
    email: user.email,
    subject: '이메일 주소를 인증해주세요',
    body: EmailVerificationTemplate({ code }),
  });
};
