import type { DeleteUserReq, DeleteUserRes } from '@ygg/admin-sdk';
import { users } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { db, extractErrorMessage, publishResponse } from '@ygg/shared-sdk';
import { eq } from 'drizzle-orm';

export const deleteUser = async (message: Message<string, DeleteUserReq>) => {
  const {
    payload: { id }
  } = message;

  try {
    await db(process.env.DATABASE_URL!).delete(users).where(eq(users.id, id));

    await publishResponse<DeleteUserRes>(process.env.REDIS_URL!, message, {
      success: true
    });
  } catch (error) {
    await publishResponse(
      process.env.REDIS_URL!,
      message,
      null,
      extractErrorMessage(error)
    );
  }
};
