import Redis from 'ioredis';
import { redis } from './clients';

export const publish = async (url: string, channel: string, message: unknown) =>
  redis(url).publish(channel, JSON.stringify(message));

export const subscribe = (
  url: string,
  channel: string,
  handler: (message: unknown) => void
) => {
  const subscriber = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    reconnectOnError: () => true
  });
  subscriber.subscribe(channel);
  subscriber.on('message', (_, message) => handler(JSON.parse(message)));
  return subscriber;
};
