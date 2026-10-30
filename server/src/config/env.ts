import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  STORAGE_ROOT: z.string().default('../storage'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

const resolvedStorageRoot = path.resolve(process.cwd(), parsed.data.STORAGE_ROOT);

export const env = {
  ...parsed.data,
  STORAGE_ROOT: resolvedStorageRoot,
};
