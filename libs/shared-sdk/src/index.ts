import { drizzle } from 'drizzle-orm/postgres-js';
import Redis from 'ioredis';
import postgres from 'postgres';

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

export const db = (url: string) => drizzle(postgres(url));
