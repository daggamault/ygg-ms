import {
  ADMIN_CHANNEL,
  DELETE_USER,
  type DeleteUserReq,
  type DeleteUserRes
} from '@ygg/admin-sdk';
import { publishAndAwaitResponse } from '@ygg/shared-sdk';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const deleteUser = withValidation(
  {
    params: z.object({
      id: z.string().uuid()
    })
  },
  async (_, res, { params: { id } }) => {
    await publishAndAwaitResponse<DeleteUserReq, DeleteUserRes>(
      process.env.REDIS_URL!,
      ADMIN_CHANNEL,
      DELETE_USER,
      { id }
    );

    res.status(204).send();
  }
);
