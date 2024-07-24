'use server';

import { z } from 'zod';

import { rateLimitByIp, rateLimitByKey } from '@/lib/limiter';
import { setSession } from '@/lib/session';

import { authenticatedAction } from '@/app/safe-action';

import {
  resendVerificationEmailUseCase,
  verifyEmailUseCase,
} from '@/use-cases/user';

export const verifyEmailAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      code: z.string().length(6, { message: '6자리의 숫자를 입력하세요.' }),
    })
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByIp({
      key: ctx.user.email,
      limit: 1,
      window: 10000,
    });

    await verifyEmailUseCase(ctx.user, input.code);
    await setSession(ctx.user.id);
  });

export const resendEmailAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    await rateLimitByKey({
      key: ctx.user.email,
      limit: 1,
      window: 10000,
    });
    await resendVerificationEmailUseCase(ctx.user);
  });
