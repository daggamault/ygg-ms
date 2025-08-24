import type { GetUserByEmailReq, GetUserByEmailRes } from '@ygg/admin-sdk';
import { users } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { db, extractErrorMessage, publishResponse } from '@ygg/shared-sdk';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async (
  message: Message<string, GetUserByEmailReq>
) => {
  const {
    payload: { email }
  } = message;

  try {
    const [user] = await db(process.env.DATABASE_URL!)
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    await publishResponse<GetUserByEmailRes>(process.env.REDIS_URL!, message, {
      user: user || null
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
