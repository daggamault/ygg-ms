import { Router } from 'express';
import { createUser } from './create-user';
import { deleteUser } from './delete-user';
import { getAllUsers } from './get-all-users';
import { getUserByEmail } from './get-user-by-email';
import { updateUser } from './update-user';

export const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.post('/', createUser);
usersRouter.get('/email/:email', getUserByEmail);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);
