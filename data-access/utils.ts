import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import type { PgTransaction } from 'drizzle-orm/pg-core';

import { dbPool } from '@/db';
import type * as schema from '@/db/schema';

export async function createTransaction(
  cb: (
    tx: PgTransaction<
      NeonQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
  ) => Promise<unknown>
) {
  await dbPool.transaction(cb);
}
