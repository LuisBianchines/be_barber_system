import { AppError } from '../../middlewares/app-error';
import { addMinutes, isDateInPast } from '../../utils/date';
import { prisma } from '../../lib/prisma';
import * as repo from './appointments.repository';
import { CreateAppointmentInput, RescheduleInput } from './appointments.types';

export function getAll() {
  return repo.findAll();
}

export function getMine(clientId: string) {
  return repo.findByClient(clientId);
}

export function getByBarber(barberId: string) {
  return repo.findByBarber(barberId);
}

export async function create(clientId: string, data: CreateAppointmentInput) {
  if (isDateInPast(data.appointmentDate)) throw new AppError('Data não pode ser no passado.', 400);

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service || !service.active) throw new AppError('Serviço não encontrado ou inativo.', 404);

  const barber = await prisma.barber.findUnique({ where: { id: data.barberId } });
  if (!barber || !barber.active) throw new AppError('Barbeiro não encontrado ou inativo.', 404);

  const endTime = addMinutes(data.startTime, service.durationMinutes);

  const conflict = await repo.findConflict(data.barberId, data.appointmentDate, data.startTime, endTime);
  if (conflict) throw new AppError('Horário indisponível para este barbeiro.', 409);

  return repo.create({
    clientId,
    barberId: data.barberId,
    serviceId: data.serviceId,
    appointmentDate: new Date(data.appointmentDate),
    startTime: data.startTime,
    endTime,
  });
}

export async function cancel(id: string, userId: string, role: string) {
  const appointment = await repo.findById(id);
  if (!appointment) throw new AppError('Agendamento não encontrado.', 404);
  if (role === 'CLIENT' && appointment.clientId !== userId) throw new AppError('Acesso negado.', 403);
  if (appointment.status !== 'SCHEDULED') throw new AppError('Agendamento não pode ser cancelado.', 400);
  return repo.updateStatus(id, 'CANCELLED');
}

export async function complete(id: string) {
  const appointment = await repo.findById(id);
  if (!appointment) throw new AppError('Agendamento não encontrado.', 404);
  if (appointment.status !== 'SCHEDULED') throw new AppError('Agendamento não pode ser concluído.', 400);
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

  const conflict = await repo.findConflict(appointment.barberId, data.appointmentDate, data.startTime, endTime, id);
  if (conflict) throw new AppError('Horário indisponível para este barbeiro.', 409);

  return repo.reschedule(id, new Date(data.appointmentDate), data.startTime, endTime);
}
