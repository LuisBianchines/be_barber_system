import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { createAdminToken, createClientToken, cleanTestData } from './helpers';

let adminToken: string;
let clientToken: string;
let createdServiceId: string;

beforeAll(async () => {
  await cleanTestData();
  adminToken = await createAdminToken();
  ({ token: clientToken } = await createClientToken());
});

afterAll(async () => {
  await cleanTestData();
});

describe('POST /admin/services', () => {
  it('admin cria serviço com dados válidos', async () => {
    const res = await request(app)
      .post('/admin/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Corte Test', description: 'Corte completo', price: 45, durationMinutes: 30 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Corte Test');
    expect(res.body.active).toBe(true);
    createdServiceId = res.body.id;
  });

  it('bloqueia criação de serviço como cliente', async () => {
    const res = await request(app)
      .post('/admin/services')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ name: 'Serviço Proibido', price: 10, durationMinutes: 15 });

    expect(res.status).toBe(403);
  });

  it('bloqueia criação de serviço sem autenticação', async () => {
    const res = await request(app)
      .post('/admin/services')
      .send({ name: 'Serviço Sem Auth', price: 10, durationMinutes: 15 });

    expect(res.status).toBe(401);
  });

  it('rejeita payload inválido', async () => {
    const res = await request(app)
      .post('/admin/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '', price: -1, durationMinutes: 0 });

    expect(res.status).toBe(422);
  });
});

describe('GET /services', () => {
  it('lista serviços ativos publicamente', async () => {
    const res = await request(app).get('/services');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PATCH /admin/services/:id/toggle-active', () => {
  it('admin inativa e reativa serviço', async () => {
    const inactive = await request(app)
      .patch(`/admin/services/${createdServiceId}/toggle-active`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(inactive.status).toBe(200);
    expect(inactive.body.active).toBe(false);

    const active = await request(app)
      .patch(`/admin/services/${createdServiceId}/toggle-active`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(active.body.active).toBe(true);
  });
});
