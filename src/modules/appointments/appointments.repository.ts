import { prisma } from '../../lib/prisma';

const fullInclude = {
  client: { select: { name: true, email: true } },
  barber: { include: { user: { select: { name: true } } } },
  service: true,
};

export function findAll() {
  return prisma.appointment.findMany({ include: fullInclude, orderBy: [{ appointmentDate: 'desc' }, { startTime: 'asc' }] });
}

export function findByClient(clientId: string) {
  return prisma.appointment.findMany({ where: { clientId }, include: { barber: { include: { user: { select: { name: true } } } }, service: true }, orderBy: [{ appointmentDate: 'desc' }] });
}

export function findByBarber(barberId: string) {
  return prisma.appointment.findMany({ where: { barberId }, include: { client: { select: { name: true, email: true } }, service: true }, orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }] });
}

export function findById(id: string) {
  return prisma.appointment.findUnique({ where: { id }, include: fullInclude });
}

export function findConflict(barberId: string, appointmentDate: string, startTime: string, endTime: string, excludeId?: string) {
  return prisma.appointment.findFirst({
    where: {
      barberId,
      appointmentDate: new Date(appointmentDate),
      status: 'SCHEDULED',
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export function create(data: {
  clientId: string;
  barberId: string;
  serviceId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
}) {
  return prisma.appointment.create({ data });
}

export function updateStatus(id: string, status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED') {
  return prisma.appointment.update({ where: { id }, data: { status } });
}

export function reschedule(id: string, appointmentDate: Date, startTime: string, endTime: string) {
  return prisma.appointment.update({ where: { id }, data: { appointmentDate, startTime, endTime } });
}
