import { prisma } from '../../lib/prisma';
import { AvailabilityItem } from './barbers.types';

export function findAll(onlyActive = true) {
  return prisma.barber.findMany({
    where: onlyActive ? { active: true } : undefined,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { user: { name: 'asc' } },
  });
}

export function findById(id: string) {
  return prisma.barber.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } }, availability: { where: { active: true } } },
  });
}

export function findByUserId(userId: string) {
  return prisma.barber.findUnique({ where: { userId } });
}

export async function createWithUser(data: { name: string; email: string; passwordHash: string; bio?: string }) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name: data.name, email: data.email, passwordHash: data.passwordHash, role: 'BARBER' },
    });
    const barber = await tx.barber.create({
      data: { userId: user.id, bio: data.bio },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });
    return barber;
  });
}

export function updateById(id: string, data: { bio?: string }) {
  return prisma.barber.update({ where: { id }, data });
}

export async function toggleActive(id: string) {
  const barber = await prisma.barber.findUnique({ where: { id }, select: { active: true } });
  return prisma.barber.update({ where: { id }, data: { active: !barber?.active } });
}

export function findAvailability(barberId: string) {
  return prisma.barberAvailability.findMany({ where: { barberId }, orderBy: { weekday: 'asc' } });
}

export async function setAvailabilityBulk(barberId: string, items: AvailabilityItem[]) {
  return prisma.$transaction(async (tx) => {
    await tx.barberAvailability.deleteMany({ where: { barberId } });
    return tx.barberAvailability.createMany({
      data: items.map(item => ({ barberId, ...item })),
    });
  });
}
