import { db } from './db/db';
import { users } from './db/schema/users';

const connectToDatabase = async () => {
  console.log('Connecting to database...');
  try {
    await db.select().from(users).limit(1);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const start = async () => {
  await connectToDatabase();
  console.log('Admin microservice started');
};

start().catch(console.error);
