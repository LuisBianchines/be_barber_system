import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateUserSchema } from './users.schemas';
import { getAllHandler, getByIdHandler, updateHandler } from './users.controller';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/', requireRole(['ADMIN']), getAllHandler);
usersRouter.get('/:id', getByIdHandler);
usersRouter.put('/:id', validate(updateUserSchema), updateHandler);
