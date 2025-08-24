import bcrypt from 'bcrypt';
import type { UpdateUserReq, UpdateUserRes } from '@ygg/admin-sdk';
import { users } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { db, extractErrorMessage, publishResponse } from '@ygg/shared-sdk';
import { eq } from 'drizzle-orm';

export const updateUser = async (message: Message<string, UpdateUserReq>) => {
  const {
    payload: { id, email, password }
  } = message;

  try {
    const updateData: { email?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const [user] = await db(process.env.DATABASE_URL!)
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({ id: users.id, email: users.email });

    await publishResponse<UpdateUserRes>(process.env.REDIS_URL!, message, {
      user
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
