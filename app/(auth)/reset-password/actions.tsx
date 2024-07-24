'use server';

import { ResetPasswordFormSchema } from '../definitions';

import { rateLimitByIp } from '@/lib/limiter';

import { unauthenticatedAction } from '@/app/safe-action';

import { verifyPasswordResetTokenUseCase } from '@/use-cases/user';

export const resetPasswordAction = unauthenticatedAction
  .createServerAction()
  .input(ResetPasswordFormSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: input.token,
      limit: 2,
      window: 30000,
    });
    await verifyPasswordResetTokenUseCase(input.password, input.token);
  });
