import { ADMIN_MESSAGE, type AdminGetUserByEmailMsg } from '@ygg/admin-sdk';
import { getUserByEmail } from './get-user-by-email';

type MessageHandler = (message: AdminGetUserByEmailMsg) => Promise<void>;

export const messageHandlers: Record<string, MessageHandler> = {
  [ADMIN_MESSAGE.GET_USER_BY_EMAIL]: getUserByEmail
};
