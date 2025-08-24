import {
  ADMIN_CHANNEL,
  CREATE_USER,
  type CreateUserReq,
  type CreateUserRes
} from '@ygg/admin-sdk';
import { publishAndAwaitResponse } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const createUser = withValidation(
  {
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
  },
  async (_, res, { body: { email, password } }) => {
    const { user } = await publishAndAwaitResponse<
      CreateUserReq,
      CreateUserRes
    >(process.env.REDIS_URL!, ADMIN_CHANNEL, CREATE_USER, { email, password });

    res.status(201).json(user);
  }
);
