import {
  CREATE_USER,
  DELETE_USER,
  GET_ALL_USERS,
  GET_USER_BY_EMAIL,
  HEALTH_CHECK,
  UPDATE_USER
} from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { createUser } from './create-user';
import { deleteUser } from './delete-user';
import { getAllUsers } from './get-all-users';
import { getUserByEmail } from './get-user-by-email';
import { healthCheck } from './health-check';
import { updateUser } from './update-user';

type MessageHandler = (message: Message<string, unknown>) => Promise<void>;

export const messageHandlers: Record<string, MessageHandler> = {
  [GET_USER_BY_EMAIL]: getUserByEmail,
  [GET_ALL_USERS]: getAllUsers,
  [CREATE_USER]: createUser,
  [UPDATE_USER]: updateUser,
  [DELETE_USER]: deleteUser,
  [HEALTH_CHECK]: healthCheck
};
