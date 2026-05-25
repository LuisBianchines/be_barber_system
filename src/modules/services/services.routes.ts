import { Router } from 'express';
import { getAllHandler, getByIdHandler } from './services.controller';

export const servicesRouter = Router();

servicesRouter.get('/', getAllHandler);
servicesRouter.get('/:id', getByIdHandler);
