import { z } from 'zod';

export const createBarberSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    bio: z.string().optional(),
  }),
});

export const updateBarberSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
  }),
});

const availabilityItemSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  active: z.boolean().default(true),
}).refine(data => data.startTime < data.endTime, {
  message: 'startTime deve ser menor que endTime',
});

export const bulkAvailabilitySchema = z.object({
  body: z.object({
    items: z.array(availabilityItemSchema).min(1),
  }),
});
