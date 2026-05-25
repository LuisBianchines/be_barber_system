import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createServiceSchema, updateServiceSchema } from './services.schemas';
import { getAllHandler, getByIdHandler, createHandler, updateHandler, deleteHandler } from './services.controller';

export const servicesRouter = Router();

servicesRouter.get('/', getAllHandler);
servicesRouter.get('/:id', getByIdHandler);
servicesRouter.post('/', authenticate, requireRole(['ADMIN']), validate(createServiceSchema), createHandler);
servicesRouter.put('/:id', authenticate, requireRole(['ADMIN']), validate(updateServiceSchema), updateHandler);
servicesRouter.delete('/:id', authenticate, requireRole(['ADMIN']), deleteHandler);
