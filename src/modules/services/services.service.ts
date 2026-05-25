import { AppError } from '../../middlewares/app-error';
import * as repo from './services.repository';
import { CreateServiceInput, UpdateServiceInput } from './services.types';

export function getAll() {
  return repo.findAll();
}

export async function getById(id: string) {
  const service = await repo.findById(id);
  if (!service) throw new AppError('Serviço não encontrado.', 404);
  return service;
}

export function create(data: CreateServiceInput) {
  return repo.create(data);
}

export async function update(id: string, data: UpdateServiceInput) {
  await getById(id);
  return repo.updateById(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteById(id);
}
