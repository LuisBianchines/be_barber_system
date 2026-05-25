import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createBarberSchema, updateBarberSchema, availabilitySchema } from './barbers.schemas';
import {
  getAllHandler, getByIdHandler, createHandler, updateHandler, deleteHandler,
  getAvailabilityHandler, createAvailabilityHandler, updateAvailabilityHandler, deleteAvailabilityHandler,
} from './barbers.controller';

export const barbersRouter = Router();

barbersRouter.get('/', getAllHandler);
barbersRouter.get('/:id', getByIdHandler);
barbersRouter.post('/', authenticate, requireRole(['ADMIN']), validate(createBarberSchema), createHandler);
barbersRouter.put('/:id', authenticate, requireRole(['ADMIN']), validate(updateBarberSchema), updateHandler);
barbersRouter.delete('/:id', authenticate, requireRole(['ADMIN']), deleteHandler);

barbersRouter.get('/:barberId/availability', getAvailabilityHandler);
barbersRouter.post('/:barberId/availability', authenticate, requireRole(['ADMIN']), validate(availabilitySchema), createAvailabilityHandler);
barbersRouter.put('/:barberId/availability/:id', authenticate, requireRole(['ADMIN']), validate(availabilitySchema), updateAvailabilityHandler);
barbersRouter.delete('/:barberId/availability/:id', authenticate, requireRole(['ADMIN']), deleteAvailabilityHandler);
