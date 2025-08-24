import { Router } from 'express';
import { getUserByEmail } from './get-user-by-email';
import { getAllUsers } from './get-all-users';
import { createUser } from './create-user';
import { updateUser } from './update-user';
import { deleteUser } from './delete-user';

export const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.post('/', createUser);
usersRouter.get('/email/:email', getUserByEmail);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);
