import { prisma } from '../../lib/prisma';

const safeSelect = { id: true, name: true, email: true, role: true, createdAt: true };

export function findById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: safeSelect });
}

export function findAll() {
  return prisma.user.findMany({ select: safeSelect });
}

export function updateById(id: string, data: { name?: string }) {
  return prisma.user.update({ where: { id }, data, select: safeSelect });
}
