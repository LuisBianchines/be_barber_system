import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(422).json({
        message: 'Dados inválidos.',
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data.body ?? req.body;
    return next();
  };
}
