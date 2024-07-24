'use server';

import { LoginFormSchema } from '../definitions';
import { redirect } from 'next/navigation';

import { rateLimitByKey } from '@/lib/limiter';
import { setSession } from '@/lib/session';

import { unauthenticatedAction } from '@/app/safe-action';

import { loginUseCase } from '@/use-cases/user';

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(LoginFormSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    await rateLimitByKey({ key: input.email, limit: 3, window: 10000 });
    const user = await loginUseCase(input.email, input.password);
    await setSession(user.id);
    redirect('/');
  });
