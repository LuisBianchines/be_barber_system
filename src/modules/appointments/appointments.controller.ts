import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as appointmentsService from './appointments.service';

export async function getAllHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.getAll()); } catch (err) { return next(err); }
}

export async function getMineHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.getMine(req.user!.sub)); } catch (err) { return next(err); }
}

export async function getByBarberHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.getByBarber(req.params.barberId)); } catch (err) { return next(err); }
}

export async function createHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.status(201).json(await appointmentsService.create(req.user!.sub, req.body)); } catch (err) { return next(err); }
}

export async function cancelHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.cancel(req.params.id, req.user!.sub, req.user!.role)); } catch (err) { return next(err); }
}

export async function completeHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.complete(req.params.id)); } catch (err) { return next(err); }
}

export async function rescheduleHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await appointmentsService.reschedule(req.params.id, req.user!.sub, req.body)); } catch (err) { return next(err); }
}
