import { redis } from '@ygg/shared-sdk';
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
  res.json({
    api: { status: 'up' },
    services: { admin: { status: 'up' } },
    redis: {
      status: (await redis(process.env.REDIS_URL!).ping()) ? 'up' : 'down'
    },
    timestamp: new Date().toISOString()
  } as HealthRes);
});
