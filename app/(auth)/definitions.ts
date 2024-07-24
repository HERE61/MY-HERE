import { z } from 'zod';

export const ForgotPasswordFormSchema = z.object({
  email: z
    .string({ required_error: '이메일를 입력해 주세요.' })
    .email({ message: '유효한 이메일을 입력해 주세요.' }),
});

export const ResetPasswordFormSchema = z
  .object({
    token: z.string(),
    password: z
      .string({ required_error: '새 비밀번호를 입력해 주세요.' })
      .min(10, { message: '10자 이상이어야 합니다.' }),
    confirmPassword: z.string({
      required_error: '새 비밀번호 확인을 입력해 주세요.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: '이메일를 입력해 주세요.' })
    .email({ message: '유효한 이메일을 입력해 주세요.' }),
  password: z
    .string({ required_error: '비밀번호를 입력해 주세요.' })
    .min(1, { message: '비밀번호 필드를 비워 둘 수 없습니다.' }),
});

export const SignupFormSchema = z.object({
  email: z
    .string({ required_error: '이메일를 입력해 주세요.' })
    .email({ message: '유효한 이메일을 입력해 주세요.' })
    .trim()
    .default(''),
  password: z
    .string({ required_error: '비밀번호를 입력해 주세요.' })
    .min(10, { message: '10자 이상이어야 합니다.' })
    .trim()
    .default(''),
});

export const EmailVerifyFormSchema = z.object({
  code: z.string().length(6, { message: '6자리의 숫자를 입력하세요.' }),
});
