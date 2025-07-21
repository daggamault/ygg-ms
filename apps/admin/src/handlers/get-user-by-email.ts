import type {
  AdminGetUserByEmailMsg,
  AdminGetUserByEmailRes
} from '@ygg/admin-sdk';
import { db, extractErrorMessage, reply } from '@ygg/shared-sdk';
import { eq } from 'drizzle-orm';
import { users } from '../schema/users';

export const getUserByEmail = async (message: AdminGetUserByEmailMsg) => {
  const {
    payload: { email }
  } = message;

  try {
    const [user] = await db(process.env.DATABASE_URL!)
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    await reply<AdminGetUserByEmailRes>(process.env.REDIS_URL!, message, {
      user: user || null
    });
  } catch (error) {
    await reply(
      process.env.REDIS_URL!,
      message,
      null,
      extractErrorMessage(error)
    );
  }
};
