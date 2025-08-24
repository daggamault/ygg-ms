import {
  ADMIN_CHANNEL,
  GET_ALL_USERS,
  type GetAllUsersReq,
  type GetAllUsersRes
} from '@ygg/admin-sdk';
import { publishAndAwaitResponse } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const getAllUsers = withValidation(
  {
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10)
    })
  },
  async (_, res, { query: { page, limit } }) => {
    const { data, total } = await publishAndAwaitResponse<
      GetAllUsersReq,
      GetAllUsersRes
    >(process.env.REDIS_URL!, ADMIN_CHANNEL, GET_ALL_USERS, { page, limit });

    res.json({ data, total, page, limit });
  }
);
