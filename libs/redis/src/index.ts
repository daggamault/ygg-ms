import Redis from 'ioredis';

const clients = new Map<string, Redis>();

export const redis = (url: string) => {
  if (!clients.has(url))
    clients.set(
      url,
      new Redis(url, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        reconnectOnError: (_err: Error) => true
      })
    );
  return clients.get(url)!;
};
