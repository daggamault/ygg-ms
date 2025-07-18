import { healthRouter } from './health';
import { usersRouter } from './users';

export const routers = [
  { path: '/', router: healthRouter },
  { path: '/users', router: usersRouter }
];
