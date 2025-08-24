import type { GetAllUsersReq, GetAllUsersRes } from '@ygg/admin-sdk';
import { users } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { db, extractErrorMessage, publishResponse } from '@ygg/shared-sdk';
import { count } from 'drizzle-orm';

export const getAllUsers = async (message: Message<string, GetAllUsersReq>) => {
  const {
    payload: { page = 1, limit = 10 }
  } = message;

  try {
    const offset = (page - 1) * limit;

    const [userResults, totalResults] = await Promise.all([
      db(process.env.DATABASE_URL!)
        .select({ id: users.id, email: users.email })
        .from(users)
        .limit(limit)
        .offset(offset),
      db(process.env.DATABASE_URL!).select({ count: count() }).from(users)
    ]);

    await publishResponse<GetAllUsersRes>(process.env.REDIS_URL!, message, {
      data: userResults,
      total: totalResults[0].count,
      page,
      limit
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
