import { prisma } from '../../lib/prisma';
import { CreateServiceInput, UpdateServiceInput } from './services.types';

export function findAll(onlyActive = true) {
  return prisma.service.findMany({
    where: onlyActive ? { active: true } : undefined,
    orderBy: { name: 'asc' },
  });
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

export async function toggleActive(id: string) {
  const service = await prisma.service.findUnique({ where: { id }, select: { active: true } });
  return prisma.service.update({ where: { id }, data: { active: !service?.active } });
}
