import {
  GET_USER_BY_EMAIL,
  GET_ALL_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
} from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { getUserByEmail } from './get-user-by-email';
import { getAllUsers } from './get-all-users';
import { createUser } from './create-user';
import { updateUser } from './update-user';
import { deleteUser } from './delete-user';

type MessageHandler = (message: Message<string, unknown>) => Promise<void>;

export const messageHandlers: Record<string, MessageHandler> = {
  [GET_USER_BY_EMAIL]: getUserByEmail,
  [GET_ALL_USERS]: getAllUsers,
  [CREATE_USER]: createUser,
  [UPDATE_USER]: updateUser,
  [DELETE_USER]: deleteUser
};
