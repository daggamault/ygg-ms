import type { Request, Response } from 'express';
import { z } from 'zod';

type ValidationSchemas = {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
};

type ValidatedHandler<T = never, U = never, V = never> = (
  req: Request,
  res: Response,
  data: { body?: T; query?: U; params?: V }
) => void | Promise<void>;

export const withValidation = <T = never, U = never, V = never>(
  schemas: ValidationSchemas,
  handler: ValidatedHandler<T, U, V>
) => {
  return async (req: Request, res: Response) => {
    const validatedData: { body?: T; query?: U; params?: V } = {};

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

    if (schemas.params) {
      const { success, data, error } = await schemas.params.safeParseAsync(
        req.params
      );
      if (!success) return res.status(400).json(z.treeifyError(error));
      validatedData.params = data as V;
    }

    return handler(req, res, validatedData);
  };
};
