import { Request, Response, NextFunction } from 'express';
import * as barbersService from './barbers.service';

export async function getAllHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getAll()); } catch (err) { return next(err); }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getById(req.params.id)); } catch (err) { return next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await barbersService.create(req.body)); } catch (err) { return next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.update(req.params.id, req.body)); } catch (err) { return next(err); }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try { await barbersService.remove(req.params.id); return res.status(204).send(); } catch (err) { return next(err); }
}

export async function getAvailabilityHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.getAvailability(req.params.barberId)); } catch (err) { return next(err); }
}

export async function createAvailabilityHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await barbersService.createAvailability(req.params.barberId, req.body)); } catch (err) { return next(err); }
}

export async function updateAvailabilityHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await barbersService.updateAvailability(req.params.barberId, req.params.id, req.body)); } catch (err) { return next(err); }
}

export async function deleteAvailabilityHandler(req: Request, res: Response, next: NextFunction) {
  try { await barbersService.deleteAvailability(req.params.barberId, req.params.id); return res.status(204).send(); } catch (err) { return next(err); }
}
