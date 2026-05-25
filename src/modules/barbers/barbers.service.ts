import { AppError } from '../../middlewares/app-error';
import * as repo from './barbers.repository';
import { CreateBarberInput, UpdateBarberInput, AvailabilityInput } from './barbers.types';

export function getAll() {
  return repo.findAll();
}

export async function getById(id: string) {
  const barber = await repo.findById(id);
  if (!barber) throw new AppError('Barbeiro não encontrado.', 404);
  return barber;
}

export function create(data: CreateBarberInput) {
  return repo.create(data);
}

export async function update(id: string, data: UpdateBarberInput) {
  await getById(id);
  return repo.updateById(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteById(id);
}

export function getAvailability(barberId: string) {
  return repo.findAvailability(barberId);
}

export async function createAvailability(barberId: string, data: AvailabilityInput) {
  await getById(barberId);
  return repo.createAvailability(barberId, data);
}

export async function updateAvailability(barberId: string, id: string, data: AvailabilityInput) {
  await getById(barberId);
  return repo.updateAvailability(id, data);
}

export async function deleteAvailability(barberId: string, id: string) {
  await getById(barberId);
  return repo.deleteAvailability(id);
}
