import { createServerActionProcedure } from 'zsa';

import { rateLimitByKey } from '@/lib/limiter';
import { assertAuthenticated } from '@/lib/session';

import { PublicError } from '@/use-cases/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError;
  // let's all errors pass through to the UI so debugging locally is easier
  const isDev = process.env.NODE_ENV === 'development';
  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err?.code ?? 'ERROR',
      name: err?.name ?? 'Error',
      message: `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${
        err?.message
      }`,
    };
  } else {
    return {
      code: 'ERROR',
      name: 'Error',
      message: 'Something went wrong',
    };
  }
}

export const unauthenticatedAction = createServerActionProcedure().handler(
  async () => {
    await rateLimitByKey({
      key: `unauthenticated-global`,
      limit: 10,
      window: 10000,
    });
  }
);

export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated();
    await rateLimitByKey({
      key: `${user.id}-global`,
      limit: 10,
      window: 10000,
    });
    return { user };
  });
