import type { Request, Response } from 'express';
import { z } from 'zod';

type ValidationSchemas = {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
};

type ValidatedHandler<T = never, U = never> = (
  req: Request,
  res: Response,
  data: { body?: T; query?: U }
) => void | Promise<void>;

export const withValidation = <T = never, U = never>(
  schemas: ValidationSchemas,
  handler: ValidatedHandler<T, U>
) => {
  return async (req: Request, res: Response) => {
    const validatedData: { body?: T; query?: U } = {};

    if (schemas.query) {
      const { success, data, error } = await schemas.query.safeParseAsync(
        req.query
      );
      if (!success) return res.status(400).json(z.treeifyError(error));
      validatedData.query = data as U;
    }

    if (schemas.body) {
      const { success, data, error } = await schemas.body.safeParseAsync(
        req.body
      );
      if (!success) return res.status(400).json(z.treeifyError(error));
      validatedData.body = data as T;
    }

    return handler(req, res, validatedData);
  };
};
