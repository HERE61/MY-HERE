'use server';

import { SignupFormSchema } from '../definitions';
import { redirect } from 'next/navigation';

import { rateLimitByIp } from '@/lib/limiter';
import { setSession } from '@/lib/session';

import { unauthenticatedAction } from '@/app/safe-action';

import { registerUserUseCase } from '@/use-cases/user';

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(SignupFormSchema, {
    type: 'formData',
  })
  .handler(async ({ input }) => {
    await rateLimitByIp({
      key: 'register',
      limit: 3,
      window: 30000,
    });
    const user = await registerUserUseCase(input.email, input.password);
    await setSession(user.id);
    redirect('/verify-email');
  });
