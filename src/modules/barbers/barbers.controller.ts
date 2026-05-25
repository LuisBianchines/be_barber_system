import { Request, Response, NextFunction } from 'express';
import * as barbersService from './barbers.service';

export async function getAllHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const onlyActive = req.query['active'] !== 'false';
    return res.json(await barbersService.getAll(onlyActive));
  } catch (err) { return next(err); }
}

export async function getAllAdminHandler(_req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getAll(false)); } catch (err) { return next(err); }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getById(req.params.id as string)); } catch (err) { return next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await barbersService.createBarberWithUser(req.body)); } catch (err) { return next(err); }
}

export async function toggleActiveHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.toggleActive(req.params.id as string)); } catch (err) { return next(err); }
}

export async function getAvailabilityHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getAvailability(req.params.barberId as string)); } catch (err) { return next(err); }
}

export async function setAvailabilityBulkHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.setAvailabilityBulk(req.params.barberId as string, req.body)); } catch (err) { return next(err); }
}
