import type { Request, Response } from 'express';
import { z } from 'zod';
import { withValidation } from '../../middlewares';

export const getUserByEmail = withValidation(
  {
    query: z.object({
      email: z.email()
    })
  },
  (_req: Request, res: Response, { query }) => {
    const { email } = query;

    res.json({
      email,
      message: 'User lookup by email - implementation pending'
    });
  }
);
