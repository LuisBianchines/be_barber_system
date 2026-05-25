import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

const email = 'auth-user@test.com';

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: { endsWith: '@test.com' } } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { endsWith: '@test.com' } } });
});

describe('POST /auth/register', () => {
  it('cria usuário com dados válidos', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Usuário Teste', email, password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.role).toBe('CLIENT');
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('rejeita e-mail duplicado', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Outro', email, password: '123456' });

    expect(res.status).toBe(409);
  });

  it('rejeita payload inválido', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'X', email: 'nao-e-email', password: '123' });

    expect(res.status).toBe(422);
  });
});

describe('POST /auth/login', () => {
  it('retorna token com credenciais válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('rejeita senha inválida', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'senha-errada' });

    expect(res.status).toBe(401);
  });
});

describe('GET /auth/me', () => {
  it('retorna usuário autenticado', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ email, password: '123456' });

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  it('bloqueia requisição sem token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });
});
