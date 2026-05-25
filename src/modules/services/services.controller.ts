import { Request, Response, NextFunction } from 'express';
import * as servicesService from './services.service';

export async function getAllHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.getAll()); } catch (err) { return next(err); }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.getById(req.params.id)); } catch (err) { return next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await servicesService.create(req.body)); } catch (err) { return next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.update(req.params.id, req.body)); } catch (err) { return next(err); }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction) {
  try { await servicesService.remove(req.params.id); return res.status(204).send(); } catch (err) { return next(err); }
}
