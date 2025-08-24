import type { UserPublic } from './schema/users';
import type { PaginationReq, PaginatedRes } from './types';

export const GET_ALL_USERS = 'get-all-users';
export type GetAllUsersReq = PaginationReq;
export type GetAllUsersRes = PaginatedRes<UserPublic>;

export const CREATE_USER = 'create-user';
export type CreateUserReq = { email: string; password: string };
export type CreateUserRes = { user: UserPublic };

export const UPDATE_USER = 'update-user';
export type UpdateUserReq = { id: string; email?: string; password?: string };
export type UpdateUserRes = { user: UserPublic };

export const DELETE_USER = 'delete-user';
export type DeleteUserReq = { id: string };
export type DeleteUserRes = { success: boolean };
