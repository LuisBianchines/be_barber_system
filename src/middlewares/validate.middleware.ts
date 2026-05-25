import { Request, Response, NextFunction } from 'express';
import { z, ZodTypeAny } from 'zod';

export function validate(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(422).json({
        message: 'Dados inválidos.',
        errors: (result as z.ZodSafeParseError<unknown>).error.flatten().fieldErrors,
      });
    }

    const data = result.data as { body?: unknown; params?: unknown; query?: unknown };
    if (data.body !== undefined) req.body = data.body;
    if (data.query !== undefined) req.query = data.query as Record<string, string>;
    return next();
  };
}
