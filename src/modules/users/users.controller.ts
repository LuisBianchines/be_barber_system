import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as usersService from './users.service';

export async function getAllHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await usersService.getAll()); } catch (err) { return next(err); }
}

export async function getByIdHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await usersService.getById(req.params.id as string)); } catch (err) { return next(err); }
}

export async function updateHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try { return res.json(await usersService.update(req.params.id as string, req.body)); } catch (err) { return next(err); }
}
