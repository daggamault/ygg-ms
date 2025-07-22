import {
  ADMIN_CHANNEL,
  GET_USER_BY_EMAIL,
  type GetUserByEmailReq,
  type GetUserByEmailRes
} from '@ygg/admin-sdk';
import { publishAndAwaitResponse } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const getUserByEmail = withValidation(
  {
    params: z.object({
      email: z.email()
    })
  },
  async (_, res, { params: { email } }) => {
    const { user } = await publishAndAwaitResponse<
      GetUserByEmailReq,
      GetUserByEmailRes
    >(process.env.REDIS_URL!, ADMIN_CHANNEL, GET_USER_BY_EMAIL, { email });

    res.json(user);
  }
);
