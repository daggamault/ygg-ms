import type { Message } from '@ygg/shared-sdk';

export const ADMIN_MESSAGES = 'admin-messages';

export const ADMIN_MESSAGE = {
  GET_USER_BY_EMAIL: 'admin-get-user-by-email-msg'
} as const;

export type AdminGetUserByEmailReq = { email: string };
export type AdminGetUserByEmailRes = {
  user: { id: string; email: string } | null;
};

export type AdminGetUserByEmailMsg = Message<
  typeof ADMIN_MESSAGE.GET_USER_BY_EMAIL,
  AdminGetUserByEmailReq
>;
