import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { createBarberSchema, bulkAvailabilitySchema } from './barbers.schemas';
import {
  getAllAdminHandler, createHandler, toggleActiveHandler,
  getAvailabilityHandler, setAvailabilityBulkHandler,
} from './barbers.controller';

export const barbersAdminRouter = Router();

barbersAdminRouter.get('/', getAllAdminHandler);
barbersAdminRouter.post('/', validate(createBarberSchema), createHandler);
barbersAdminRouter.patch('/:id/toggle-active', toggleActiveHandler);
barbersAdminRouter.get('/:barberId/availability', getAvailabilityHandler);
barbersAdminRouter.put('/:barberId/availability', validate(bulkAvailabilitySchema), setAvailabilityBulkHandler);
