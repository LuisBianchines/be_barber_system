import { Router } from 'express';
import { getSummaryHandler } from './reports.controller';

export const reportsRouter = Router();

reportsRouter.get('/summary', getSummaryHandler);
