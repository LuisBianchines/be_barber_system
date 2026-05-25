import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    barberId: z.string().uuid(),
    serviceId: z.string().uuid(),
    appointmentDate: z.string().date(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
  }),
});

export const rescheduleSchema = z.object({
  body: z.object({
    appointmentDate: z.string().date(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
  }),
});

export const availableSlotsSchema = z.object({
  query: z.object({
    barberId: z.string().uuid(),
    serviceId: z.string().uuid(),
    date: z.string().date(),
  }),
});
