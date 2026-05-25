import { AppError } from '../../middlewares/app-error';
import { hashPassword } from '../../lib/password';
import * as repo from './barbers.repository';
import { CreateBarberWithUserInput, UpdateBarberInput, BulkAvailabilityInput } from './barbers.types';

export function getAll(onlyActive = true) {
  return repo.findAll(onlyActive);
}

export async function getById(id: string) {
  const barber = await repo.findById(id);
  if (!barber) throw new AppError('Barbeiro não encontrado.', 404);
  return barber;
}

export async function createBarberWithUser(data: CreateBarberWithUserInput) {
  const passwordHash = await hashPassword(data.password);
  return repo.createWithUser({ name: data.name, email: data.email, passwordHash, bio: data.bio });
}

export async function update(id: string, data: UpdateBarberInput) {
  await getById(id);
  return repo.updateById(id, data);
}

export async function toggleActive(id: string) {
  await getById(id);
  return repo.toggleActive(id);
}

export function getAvailability(barberId: string) {
  return repo.findAvailability(barberId);
}

export async function setAvailabilityBulk(barberId: string, data: BulkAvailabilityInput) {
  await getById(barberId);
  await repo.setAvailabilityBulk(barberId, data.items);
  return repo.findAvailability(barberId);
}
