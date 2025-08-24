import { ADMIN_CHANNEL, HEALTH_CHECK } from '@ygg/admin-sdk';
import { publishAndAwaitResponse, redis } from '@ygg/shared-sdk';
import { Router } from 'express';

type Health = 'up' | 'down';

type HealthRes = {
  api: { status: Health };
  services: { admin: { status: Health } };
  redis: { status: Health };
  timestamp: string;
};

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const getAdminStatus = async (): Promise<Health> => {
    try {
      await publishAndAwaitResponse(
        process.env.REDIS_URL!,
        ADMIN_CHANNEL,
        HEALTH_CHECK,
        {},
        3000
      );
      return 'up';
    } catch {
      return 'down';
    }
  };

  const getRedisStatus = async (): Promise<Health> => {
    try {
      await redis(process.env.REDIS_URL!).ping();
      return 'up';
    } catch {
      return 'down';
    }
  };

  res.json({
    api: { status: 'up' },
    services: { admin: { status: await getAdminStatus() } },
    redis: { status: await getRedisStatus() },
    timestamp: new Date().toISOString()
  } as HealthRes);
});
