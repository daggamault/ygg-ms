export const GET_USER_BY_EMAIL = 'get-user-by-email';

export type GetUserByEmailReq = { email: string };

export type GetUserByEmailRes = { user: { id: string; email: string } | null };
