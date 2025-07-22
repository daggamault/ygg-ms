import { publish, subscribe } from './messaging';
import type { Message } from './types';

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

export const publishAndAwaitResponse = async <TRequest, TResponse>(
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

export const publishResponse = async <T>(
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
