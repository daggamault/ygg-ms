import type { Message } from '@ygg/shared-sdk';
import { publishResponse } from '@ygg/shared-sdk';

export const healthCheck = async (message: Message<string, unknown>) => {
  await publishResponse(process.env.REDIS_URL!, message, null);
};
