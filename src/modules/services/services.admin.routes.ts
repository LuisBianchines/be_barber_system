import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { createServiceSchema, updateServiceSchema } from './services.schemas';
import { getAllAdminHandler, createHandler, updateHandler, toggleActiveHandler } from './services.controller';

export const servicesAdminRouter = Router();

servicesAdminRouter.get('/', getAllAdminHandler);
servicesAdminRouter.post('/', validate(createServiceSchema), createHandler);
servicesAdminRouter.put('/:id', validate(updateServiceSchema), updateHandler);
servicesAdminRouter.patch('/:id/toggle-active', toggleActiveHandler);
