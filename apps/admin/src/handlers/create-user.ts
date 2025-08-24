import type { CreateUserReq, CreateUserRes } from '@ygg/admin-sdk';
import { users } from '@ygg/admin-sdk';
import type { Message } from '@ygg/shared-sdk';
import { db, extractErrorMessage, publishResponse } from '@ygg/shared-sdk';
import bcrypt from 'bcrypt';

export const createUser = async (message: Message<string, CreateUserReq>) => {
  const {
    payload: { email, password }
  } = message;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await db(process.env.DATABASE_URL!)
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning({ id: users.id, email: users.email });

    await publishResponse<CreateUserRes>(process.env.REDIS_URL!, message, {
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
