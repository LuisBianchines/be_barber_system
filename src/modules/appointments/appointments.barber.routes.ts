import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { getBarberScheduleHandler } from './appointments.controller';

export const barberRouter = Router();

barberRouter.get('/appointments', authenticate, requireRole(['BARBER', 'ADMIN']), getBarberScheduleHandler);
