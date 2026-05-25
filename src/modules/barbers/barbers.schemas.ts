import { z } from 'zod';

export const createBarberSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    bio: z.string().optional(),
  }),
});

export const updateBarberSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const availabilitySchema = z.object({
  body: z.object({
    weekday: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  }),
});
