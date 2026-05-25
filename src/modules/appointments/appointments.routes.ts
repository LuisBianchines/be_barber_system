import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createAppointmentSchema, rescheduleSchema } from './appointments.schemas';
import {
  getAllHandler, getMineHandler, getByBarberHandler,
  createHandler, cancelHandler, completeHandler, rescheduleHandler,
} from './appointments.controller';

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

appointmentsRouter.get('/', requireRole(['ADMIN', 'BARBER']), getAllHandler);
appointmentsRouter.get('/my', getMineHandler);
appointmentsRouter.get('/barber/:barberId', requireRole(['ADMIN', 'BARBER']), getByBarberHandler);
appointmentsRouter.post('/', validate(createAppointmentSchema), createHandler);
appointmentsRouter.patch('/:id/cancel', cancelHandler);
appointmentsRouter.patch('/:id/complete', requireRole(['ADMIN', 'BARBER']), completeHandler);
appointmentsRouter.patch('/:id/reschedule', validate(rescheduleSchema), rescheduleHandler);
