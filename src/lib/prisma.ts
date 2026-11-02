import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { SEED_SQLITE_BASE64 } from './db-seed';

function resolveDatabaseUrl(): string {
  // If external non-sqlite database URL provided (e.g. Postgres on Supabase/Neon)
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Detect serverless environment (Vercel, AWS Lambda)
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT
  );

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'cuckoo.db');

    if (!fs.existsSync(tmpDbPath)) {
      let restored = false;

      // 1. Check if dev.db was bundled to disk
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join('/var/task', 'prisma', 'dev.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            restored = true;
            console.log(`[Prisma] Restored SQLite DB from candidate disk path: ${candidate}`);
            break;
          } catch (err) {
            console.error(`[Prisma] Failed to copy from ${candidate}:`, err);
          }
        }
      }

      // 2. If not found on read-only lambda disk, extract embedded seed SQLite binary
      if (!restored && SEED_SQLITE_BASE64) {
        try {
          const buffer = Buffer.from(SEED_SQLITE_BASE64, 'base64');
          fs.writeFileSync(tmpDbPath, buffer);
          console.log(`[Prisma] Successfully initialized /tmp/cuckoo.db from embedded seed (${buffer.length} bytes)`);
          restored = true;
        } catch (err) {
          console.error('[Prisma] Failed to write embedded SQLite seed:', err);
        }
      }
    }

    const sqliteUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = sqliteUrl;
    return sqliteUrl;
  }

  // Local development fallback
  const localUrl = process.env.DATABASE_URL || 'file:./dev.db';
  return localUrl;
}

const activeDbUrl = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
