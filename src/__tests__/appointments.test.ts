import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import {
  createAdminToken,
  createClientToken,
  createTestService,
  createTestBarberWithAvailability,
  getNextDateString,
  cleanTestData,
} from './helpers';

let adminToken: string;
let clientToken: string;
let clientUserId: string;
let serviceId: string;
let barberId: string;
let appointmentId: string;
const appointmentDate = getNextDateString();

beforeAll(async () => {
  await cleanTestData();
  adminToken = await createAdminToken();
  ({ token: clientToken, userId: clientUserId } = await createClientToken());
  const service = await createTestService(adminToken);
  serviceId = service.id;
  const barber = await createTestBarberWithAvailability(adminToken);
  barberId = barber.id;
});

afterAll(async () => {
  await cleanTestData();
});

describe('GET /appointments/available-slots', () => {
  it('retorna slots disponíveis para a data', async () => {
    const res = await request(app)
      .get('/appointments/available-slots')
      .set('Authorization', `Bearer ${clientToken}`)
      .query({ barberId, serviceId, date: appointmentDate });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('POST /appointments', () => {
  it('cliente cria agendamento válido', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ barberId, serviceId, appointmentDate, startTime: '10:00' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SCHEDULED');
    expect(res.body.startTime).toBe('10:00');
    expect(res.body.endTime).toBe('10:30');
    appointmentId = res.body.id;
  });

  it('bloqueia agendamento conflitante no mesmo horário', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ barberId, serviceId, appointmentDate, startTime: '10:00' });

    expect(res.status).toBe(409);
  });

  it('bloqueia agendamento sobreposto parcialmente', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ barberId, serviceId, appointmentDate, startTime: '10:15' });

    expect(res.status).toBe(409);
  });

  it('permite agendamento em horário livre após o anterior', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ barberId, serviceId, appointmentDate, startTime: '10:30' });

    expect(res.status).toBe(201);
  });

  it('rejeita data no passado', async () => {
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ barberId, serviceId, appointmentDate: '2020-01-01', startTime: '10:00' });

    expect(res.status).toBe(400);
  });
});

describe('GET /appointments/me', () => {
  it('cliente lista seus próprios agendamentos', async () => {
    const res = await request(app)
      .get('/appointments/me')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((a: { clientId: string }) => a.clientId === clientUserId)).toBe(true);
  });
});

describe('PATCH /appointments/:id/cancel', () => {
  it('cliente cancela seu próprio agendamento', async () => {
    const res = await request(app)
      .patch(`/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELLED');
  });

  it('não cancela agendamento já cancelado', async () => {
    const res = await request(app)
      .patch(`/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(400);
  });
});
