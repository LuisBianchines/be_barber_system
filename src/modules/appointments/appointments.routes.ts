import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createAppointmentSchema, rescheduleSchema, availableSlotsSchema } from './appointments.schemas';
import {
  getAvailableSlotsHandler, getAllHandler, getMineHandler,
  createHandler, cancelHandler, completeHandler, rescheduleHandler,
} from './appointments.controller';

export const appointmentsRouter = Router();

appointmentsRouter.get('/available-slots', authenticate, validate(availableSlotsSchema), getAvailableSlotsHandler);

appointmentsRouter.use(authenticate);

appointmentsRouter.get('/', requireRole(['ADMIN', 'BARBER']), getAllHandler);
appointmentsRouter.get('/me', getMineHandler);
appointmentsRouter.post('/', requireRole(['CLIENT']), validate(createAppointmentSchema), createHandler);
appointmentsRouter.patch('/:id/cancel', cancelHandler);
appointmentsRouter.patch('/:id/complete', requireRole(['ADMIN', 'BARBER']), completeHandler);
appointmentsRouter.patch('/:id/reschedule', requireRole(['CLIENT']), validate(rescheduleSchema), rescheduleHandler);
