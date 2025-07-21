import { Router } from 'express';
import { getUserByEmail } from './get-user-by-email';

export const usersRouter = Router();

usersRouter.get('/email/:email', getUserByEmail);
