import { drizzle } from 'drizzle-orm/postgres-js';
import Redis from 'ioredis';
import postgres from 'postgres';

const redisClients = new Map<string, Redis>();
const dbClients = new Map<string, ReturnType<typeof drizzle>>();

const redisConfig = {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  reconnectOnError: () => true
};

export const redis = (url: string) => {
  if (!redisClients.has(url))
    redisClients.set(url, new Redis(url, redisConfig));
  return redisClients.get(url)!;
};

export const db = (url: string) => {
  if (!dbClients.has(url)) dbClients.set(url, drizzle(postgres(url)));
  return dbClients.get(url)!;
};

export const extractErrorMessage = (error: unknown) =>
  error instanceof Error && process.env.NODE_ENV !== 'production'
    ? error?.message
    : 'An error occurred';

export const publish = async (url: string, channel: string, message: unknown) =>
  redis(url).publish(channel, JSON.stringify(message));

export const subscribe = (
  url: string,
  channel: string,
  handler: (message: unknown) => void
) => {
  const subscriber = new Redis(url, redisConfig);
  subscriber.subscribe(channel);
  subscriber.on('message', (_, message) => handler(JSON.parse(message)));
  return subscriber;
};

export type Message<T extends string, P = unknown> = {
  type: T;
  payload: P;
  correlationId: string;
  timestamp: number;
  replyTo?: string;
};

const createMessage = <T extends string, P>(
  type: T,
  payload: P,
  replyTo?: string
): Message<T, P> => ({
  type,
  payload,
  correlationId: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
  timestamp: Date.now(),
  replyTo
});

export const send = async <TRequest, TResponse>(
  redisUrl: string,
  channel: string,
  type: string,
  payload: TRequest,
  timeout = 5000
): Promise<TResponse> => {
  const replyChannel = `reply:${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const message = createMessage(type, payload, replyChannel);

  const responsePromise = new Promise<TResponse>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      subscriber.disconnect();
      reject(new Error('Request timeout'));
    }, timeout);

    const subscriber = subscribe(redisUrl, replyChannel, (response) => {
      clearTimeout(timeoutId);
      subscriber.disconnect();
      const { payload: responsePayload, error } = response as Message<
        string,
        TResponse
      > & { error?: string };
      error ? reject(new Error(error)) : resolve(responsePayload);
    });
  });

  await publish(redisUrl, channel, message);
  return responsePromise;
};

export const reply = async <T>(
  redisUrl: string,
  { replyTo }: Message<string, unknown>,
  payload: T,
  error?: string
) => {
  if (!replyTo) return;

  const response = createMessage('reply', payload) as Message<string, T> & {
    error?: string;
  };
  if (error) response.error = error;

  await publish(redisUrl, replyTo, response);
};
