import { prisma } from '../../../lib/prisma';

export async function getSummary(startDate: Date, endDate: Date) {
  const where = { appointmentDate: { gte: startDate, lte: endDate } };

  const [total, completed, cancelled, scheduled, topServicesRaw, topBarbersRaw] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
    prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } }),
    prisma.appointment.count({ where: { ...where, status: 'SCHEDULED' } }),
    prisma.appointment.groupBy({
      by: ['serviceId'],
      where,
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    }),
    prisma.appointment.groupBy({
      by: ['barberId'],
      where,
      _count: { barberId: true },
      orderBy: { _count: { barberId: 'desc' } },
      take: 5,
    }),
  ]);

  const topServices = await Promise.all(
    topServicesRaw.map(async (item) => {
      const service = await prisma.service.findUnique({ where: { id: item.serviceId }, select: { name: true } });
      return { serviceId: item.serviceId, name: service?.name ?? 'Desconhecido', count: item._count.serviceId };
    }),
  );

  const topBarbers = await Promise.all(
    topBarbersRaw.map(async (item) => {
      const barber = await prisma.barber.findUnique({ where: { id: item.barberId }, include: { user: { select: { name: true } } } });
      return { barberId: item.barberId, name: barber?.user.name ?? 'Desconhecido', count: item._count.barberId };
    }),
  );

  return { totalAppointments: total, completedAppointments: completed, cancelledAppointments: cancelled, scheduledAppointments: scheduled, topServices, topBarbers };
}
