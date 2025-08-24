import { ADMIN_CHANNEL } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { publishResponse, subscribe } from '@ygg/shared-sdk';
import { messageHandlers } from './handlers';

type AdminMessage = Message<string, unknown>;

const routeMessage = async (message: AdminMessage) => {
  const { type } = message;
  const handler = messageHandlers[type];

  if (!handler) {
    console.error(`No handler found for message type: ${type}`);
    await publishResponse(
      process.env.REDIS_URL!,
      message,
      null,
      `Unknown message type: ${type}`
    );
    return;
  }

  try {
    await handler(message);
  } catch (error) {
    console.error(`Error handling message ${type}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    await publishResponse(process.env.REDIS_URL!, message, null, errorMessage);
  }
};

const start = async () => {
  subscribe(process.env.REDIS_URL!, ADMIN_CHANNEL, async (message) => {
    await routeMessage(message as AdminMessage);
    console.log('Message processed and response sent');
  });

  console.log('Admin microservice started');
};

start().catch(console.error);
