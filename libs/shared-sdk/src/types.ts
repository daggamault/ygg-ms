export type Message<T extends string, P = unknown> = {
  type: T;
  payload: P;
  correlationId: string;
  timestamp: number;
  replyTo?: string;
};
