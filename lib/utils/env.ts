// env.ts
import { z } from 'zod';

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  // PORT: z.coerce.number().min(1000),
  NEON_DATABASE_URL_UNPOOLED: z.string().url(),
  NEON_DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string().email(),
  BASE_URL: z.string().url(),
  ENV: z
    .union([z.literal('development'), z.literal('production')])
    .default('development'),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

// Export the result so we can use it in the project
export default env;
