'use server';

import { ForgotPasswordFormSchema } from '../definitions';
import { redirect } from 'next/navigation';

import { rateLimitByIp } from '@/lib/limiter';

import { unauthenticatedAction } from '@/app/safe-action';

import { resetPasswordUseCase } from '@/use-cases/user';

export const resetPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(ForgotPasswordFormSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: input.email,
      limit: 1,
      window: 30000,
    });
    await resetPasswordUseCase(input.email);
    redirect('/login');
  });
