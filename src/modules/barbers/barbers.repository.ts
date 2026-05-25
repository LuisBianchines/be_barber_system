import { prisma } from '../../lib/prisma';
import { CreateBarberInput, UpdateBarberInput, AvailabilityInput } from './barbers.types';

export function findAll() {
  return prisma.barber.findMany({ where: { active: true }, include: { user: { select: { name: true, email: true } } } });
}

export function findById(id: string) {
  return prisma.barber.findUnique({ where: { id }, include: { user: { select: { name: true, email: true } }, availability: true } });
}

export function create(data: CreateBarberInput) {
  return prisma.barber.create({ data });
}

export function updateById(id: string, data: UpdateBarberInput) {
  return prisma.barber.update({ where: { id }, data });
}

export function deleteById(id: string) {
  return prisma.barber.update({ where: { id }, data: { active: false } });
}

export function findAvailability(barberId: string) {
  return prisma.barberAvailability.findMany({ where: { barberId } });
}

export function createAvailability(barberId: string, data: AvailabilityInput) {
  return prisma.barberAvailability.create({ data: { barberId, ...data } });
}

export function updateAvailability(id: string, data: AvailabilityInput) {
  return prisma.barberAvailability.update({ where: { id }, data });
}

export function deleteAvailability(id: string) {
  return prisma.barberAvailability.delete({ where: { id } });
}
