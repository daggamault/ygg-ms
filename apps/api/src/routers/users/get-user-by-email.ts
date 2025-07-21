import {
  ADMIN_MESSAGE,
  ADMIN_MESSAGES,
  type AdminGetUserByEmailReq,
  type AdminGetUserByEmailRes
} from '@ygg/admin-sdk';
import { send } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const getUserByEmail = withValidation(
  {
    params: z.object({
      email: z.email()
    })
  },
  async (_, res, { params: { email } }) => {
    const { user } = await send<AdminGetUserByEmailReq, AdminGetUserByEmailRes>(
      process.env.REDIS_URL!,
      ADMIN_MESSAGES,
      ADMIN_MESSAGE.GET_USER_BY_EMAIL,
      { email }
    );

    res.json(user);
  }
);
