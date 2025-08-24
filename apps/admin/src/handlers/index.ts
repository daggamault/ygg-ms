import { GET_USER_BY_EMAIL } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { getUserByEmail } from './get-user-by-email';

type MessageHandler = (message: Message<string, unknown>) => Promise<void>;

export const messageHandlers: Record<string, MessageHandler> = {
  [GET_USER_BY_EMAIL]: getUserByEmail
};
