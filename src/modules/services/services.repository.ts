import { prisma } from '../../lib/prisma';
import { CreateServiceInput, UpdateServiceInput } from './services.types';

export function findAll() {
  return prisma.service.findMany({ where: { active: true } });
}

export function findById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export function create(data: CreateServiceInput) {
  return prisma.service.create({ data });
}

export function updateById(id: string, data: UpdateServiceInput) {
  return prisma.service.update({ where: { id }, data });
}

export function deleteById(id: string) {
  return prisma.service.update({ where: { id }, data: { active: false } });
}
