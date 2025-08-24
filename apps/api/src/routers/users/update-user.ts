import {
  ADMIN_CHANNEL,
  UPDATE_USER,
  type UpdateUserReq,
  type UpdateUserRes
} from '@ygg/admin-sdk';
import { publishAndAwaitResponse } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const updateUser = withValidation(
  {
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      email: z.string().email().optional(),
      password: z.string().min(8).optional()
    })
  },
  async (_, res, { params: { id }, body: { email, password } }) => {
    const { user } = await publishAndAwaitResponse<
      UpdateUserReq,
      UpdateUserRes
    >(process.env.REDIS_URL!, ADMIN_CHANNEL, UPDATE_USER, {
      id,
      email,
      password
    });

    res.json(user);
  }
);
