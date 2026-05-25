import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/password';
import { signToken } from '../lib/jwt';

export async function createAdminToken(): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
  const user = existing ?? await prisma.user.create({
    data: {
      name: 'Admin Test',
      email: 'admin@test.com',
      passwordHash: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  });
  return signToken({ sub: user.id, email: user.email, role: user.role });
}

export async function createClientToken(): Promise<{ token: string; userId: string }> {
  const existing = await prisma.user.findUnique({ where: { email: 'cliente@test.com' } });
  const user = existing ?? await prisma.user.create({
    data: {
      name: 'Cliente Test',
      email: 'cliente@test.com',
      passwordHash: await hashPassword('cliente123'),
      role: 'CLIENT',
    },
  });
  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  return { token, userId: user.id };
}

export async function createTestService(adminToken: string) {
  const res = await request(app)
    .post('/admin/services')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Corte Test', description: 'Teste', price: 40, durationMinutes: 30 });
  return res.body as { id: string; name: string; durationMinutes: number };
}

export async function createTestBarberWithAvailability(adminToken: string) {
  const res = await request(app)
    .post('/admin/barbers')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Barbeiro Test', email: 'barbeiro@test.com', password: 'barbeiro123' });

  const barber = res.body as { id: string };

  await request(app)
    .put(`/admin/barbers/${barber.id}/availability`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      items: [0, 1, 2, 3, 4, 5, 6].map(weekday => ({
        weekday,
        startTime: '08:00',
        endTime: '18:00',
        active: true,
      })),
    });

  return barber;
}

export function getNextDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0]!;
}

export async function cleanTestData() {
  const testUsers = await prisma.user.findMany({
    where: { email: { endsWith: '@test.com' } },
    select: { id: true },
  });
  const ids = testUsers.map(u => u.id);
  if (ids.length === 0) return;

  const barbers = await prisma.barber.findMany({
    where: { userId: { in: ids } },
    select: { id: true },
  });
  const barberIds = barbers.map(b => b.id);

  await prisma.appointment.deleteMany({
    where: { OR: [{ clientId: { in: ids } }, { barberId: { in: barberIds } }] },
  });
  await prisma.barberAvailability.deleteMany({ where: { barberId: { in: barberIds } } });
  await prisma.barber.deleteMany({ where: { id: { in: barberIds } } });
  await prisma.service.deleteMany({ where: { name: { contains: 'Test' } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
}
