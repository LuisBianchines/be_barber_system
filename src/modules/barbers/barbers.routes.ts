import { Router } from 'express';
import { getAllHandler, getByIdHandler } from './barbers.controller';

export const barbersRouter = Router();

barbersRouter.get('/', getAllHandler);
barbersRouter.get('/:id', getByIdHandler);
