import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { servicesAdminRouter } from '../services/services.admin.routes';
import { barbersAdminRouter } from '../barbers/barbers.admin.routes';
import { reportsRouter } from './reports/reports.routes';

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole(['ADMIN']));

adminRouter.use('/services', servicesAdminRouter);
adminRouter.use('/barbers', barbersAdminRouter);
adminRouter.use('/reports', reportsRouter);
