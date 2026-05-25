import { Request, Response, NextFunction } from 'express';
import * as servicesService from './services.service';

export async function getAllHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const onlyActive = req.query['active'] !== 'false';
    return res.json(await servicesService.getAll(onlyActive));
  } catch (err) { return next(err); }
}

export async function getAllAdminHandler(_req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.getAll(false)); } catch (err) { return next(err); }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.getById(req.params.id as string)); } catch (err) { return next(err); }
}

export async function createHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.status(201).json(await servicesService.create(req.body)); } catch (err) { return next(err); }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.update(req.params.id as string, req.body)); } catch (err) { return next(err); }
}

export async function toggleActiveHandler(req: Request, res: Response, next: NextFunction) {
  try { return res.json(await servicesService.toggleActive(req.params.id as string)); } catch (err) { return next(err); }
}
