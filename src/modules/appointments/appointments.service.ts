import { AppError } from '../../middlewares/app-error';
import { addMinutes, isDateInPast } from '../../utils/date';
import { prisma } from '../../lib/prisma';
import { notificationService } from '../../lib/notifications';
import * as repo from './appointments.repository';
import { CreateAppointmentInput, RescheduleInput } from './appointments.types';

function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  let current = startTime;
  while (true) {
    const next = addMinutes(current, durationMinutes);
    if (next > endTime) break;
    slots.push(current);
    current = next;
  }
  return slots;
}

export async function getAvailableSlots(barberId: string, serviceId: string, date: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) throw new AppError('Serviço não encontrado.', 404);

  const weekday = new Date(`${date}T00:00:00`).getDay();

  const availability = await prisma.barberAvailability.findFirst({
    where: { barberId, weekday, active: true },
  });
  if (!availability) return [];

  const allSlots = generateSlots(availability.startTime, availability.endTime, service.durationMinutes);

  const existing = await prisma.appointment.findMany({
    where: { barberId, appointmentDate: new Date(date), status: 'SCHEDULED' },
    select: { startTime: true, endTime: true },
  });

  return allSlots.filter(slot => {
    const slotEnd = addMinutes(slot, service.durationMinutes);
    return !existing.some(appt => appt.startTime < slotEnd && appt.endTime > slot);
  });
}

export function getAll() {
  return repo.findAll();
}

export function getMine(clientId: string) {
  return repo.findByClient(clientId);
}

export function getByBarber(barberId: string) {
  return repo.findByBarber(barberId);
}

export async function getBarberSchedule(userId: string, date?: string) {
  const barber = await prisma.barber.findUnique({ where: { userId } });
  if (!barber) throw new AppError('Perfil de barbeiro não encontrado.', 404);

  const where: Parameters<typeof prisma.appointment.findMany>[0] = {
    where: {
      barberId: barber.id,
      ...(date ? { appointmentDate: new Date(date) } : {}),
    },
  };

  return prisma.appointment.findMany({
    ...where,
    include: { client: { select: { name: true, email: true } }, service: true },
    orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }],
  });
}

export async function create(clientId: string, data: CreateAppointmentInput) {
  if (isDateInPast(data.appointmentDate)) throw new AppError('Data não pode ser no passado.', 400);

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service || !service.active) throw new AppError('Serviço não encontrado ou inativo.', 404);

  const barber = await prisma.barber.findUnique({ where: { id: data.barberId }, include: { user: { select: { name: true } } } });
  if (!barber || !barber.active) throw new AppError('Barbeiro não encontrado ou inativo.', 404);

  const endTime = addMinutes(data.startTime, service.durationMinutes);

  const weekday = new Date(`${data.appointmentDate}T00:00:00`).getDay();
  const availability = await prisma.barberAvailability.findFirst({
    where: { barberId: data.barberId, weekday, active: true },
  });
  if (!availability) throw new AppError('Barbeiro não disponível neste dia.', 400);
  if (data.startTime < availability.startTime || endTime > availability.endTime) {
    throw new AppError('Horário fora da disponibilidade do barbeiro.', 400);
  }

  const conflict = await repo.findConflict(data.barberId, data.appointmentDate, data.startTime, endTime);
  if (conflict) throw new AppError('Horário indisponível para este barbeiro.', 409);

  const appointment = await repo.create({
    clientId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    appointmentDate: new Date(data.appointmentDate),
    startTime: data.startTime,
    endTime,
  });

  const client = await prisma.user.findUnique({ where: { id: clientId }, select: { name: true, email: true } });
  notificationService.sendAppointmentCreated({
    clientName: client?.name ?? '',
    clientEmail: client?.email ?? '',
    barberName: barber.user.name,
    serviceName: service.name,
    appointmentDate: data.appointmentDate,
    startTime: data.startTime,
  }).catch(() => {});

  return appointment;
}

export async function cancel(id: string, userId: string, role: string) {
  const appointment = await repo.findById(id);
  if (!appointment) throw new AppError('Agendamento não encontrado.', 404);
  if (appointment.status === 'COMPLETED') throw new AppError('Agendamento já concluído não pode ser cancelado.', 400);
  if (appointment.status === 'CANCELLED') throw new AppError('Agendamento já cancelado.', 400);
  if (role === 'CLIENT' && appointment.clientId !== userId) throw new AppError('Acesso negado.', 403);

  const updated = await repo.updateStatus(id, 'CANCELLED');

  notificationService.sendAppointmentCancelled({
    clientName: appointment.client.name,
    clientEmail: appointment.client.email ?? '',
    barberName: appointment.barber.user?.name ?? '',
    serviceName: appointment.service.name,
    appointmentDate: appointment.appointmentDate.toISOString().split('T')[0]!,
    startTime: appointment.startTime,
  }).catch(() => {});

  return updated;
}

export async function complete(id: string, userId: string, role: string) {
  const appointment = await repo.findById(id);
  if (!appointment) throw new AppError('Agendamento não encontrado.', 404);
  if (appointment.status !== 'SCHEDULED') throw new AppError('Agendamento não pode ser concluído.', 400);

  if (role === 'BARBER') {
    const barber = await prisma.barber.findUnique({ where: { userId } });
    if (!barber || barber.id !== appointment.barberId) throw new AppError('Acesso negado.', 403);
  }

  return repo.updateStatus(id, 'COMPLETED');
}

export async function reschedule(id: string, clientId: string, data: RescheduleInput) {
  const appointment = await repo.findById(id);
  if (!appointment) throw new AppError('Agendamento não encontrado.', 404);
  if (appointment.clientId !== clientId) throw new AppError('Acesso negado.', 403);
  if (appointment.status !== 'SCHEDULED') throw new AppError('Agendamento não pode ser reagendado.', 400);
  if (isDateInPast(data.appointmentDate)) throw new AppError('Data não pode ser no passado.', 400);

  const service = await prisma.service.findUnique({ where: { id: appointment.serviceId } });
  const endTime = addMinutes(data.startTime, service!.durationMinutes);

  const weekday = new Date(`${data.appointmentDate}T00:00:00`).getDay();
  const availability = await prisma.barberAvailability.findFirst({
    where: { barberId: appointment.barberId, weekday, active: true },
  });
  if (!availability) throw new AppError('Barbeiro não disponível neste dia.', 400);
  if (data.startTime < availability.startTime || endTime > availability.endTime) {
    throw new AppError('Horário fora da disponibilidade do barbeiro.', 400);
  }

  const conflict = await repo.findConflict(appointment.barberId, data.appointmentDate, data.startTime, endTime, id);
  if (conflict) throw new AppError('Horário indisponível para este barbeiro.', 409);

  return repo.reschedule(id, new Date(data.appointmentDate), data.startTime, endTime);
}
