import { drizzle } from 'drizzle-orm/postgres-js';
import Redis from 'ioredis';
import postgres from 'postgres';

const redisClients = new Map<string, Redis>();
const dbClients = new Map<string, ReturnType<typeof drizzle>>();

export const redis = (url: string) => {
  if (!redisClients.has(url))
    redisClients.set(
      url,
      new Redis(url, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        reconnectOnError: () => true
      })
    );
  return redisClients.get(url)!;
};

export const db = (url: string) => {
  if (!dbClients.has(url)) dbClients.set(url, drizzle(postgres(url)));
  return dbClients.get(url)!;
};
