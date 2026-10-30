import { Router, Request, Response } from 'express';
import { prisma } from '../../config/db.js';
import { storageService } from '../../storage/storage.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let storageStatus = 'unreachable';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${(err as Error).message}`;
  }

  try {
    const isAvailable = await storageService.fileExists('.');
    storageStatus = isAvailable ? 'accessible' : 'writable';
  } catch {
    storageStatus = 'accessible';
  }

  const payload = {
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      storage: storageStatus,
    },
    version: '1.0.0',
  };

  sendSuccess(res, payload, 'System health check');
});

export const healthRouter = router;
