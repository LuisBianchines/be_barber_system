# BarberScheduler — Spec para Agente de IA

> Projeto acadêmico: sistema web mobile first para agendamento de serviços em barbearia.
> Stack alvo: React + Vite + TypeScript no frontend, Node.js + Express + TypeScript + Prisma + PostgreSQL no backend.
> Prioridade: P0 = obrigatório para MVP, P1 = fluxo principal, P2 = gestão/admin, P3 = melhorias finais.

## Regras gerais para o agente

- Implemente somente o escopo descrito neste arquivo.
- Não crie funcionalidades fora do escopo sem necessidade direta.
- Use código simples, legível e fácil de apresentar em faculdade.
- Sempre validar entradas do usuário.
- Nunca hardcodar secrets, tokens, senhas ou URLs sensíveis.
- Manter separação clara entre camada de UI/API, regras de negócio e persistência.
- Ao finalizar, garantir que lint, build e testes básicos estejam passando.

# P0 — Setup inicial do Backend

## Objetivo

Criar a base do backend Node.js com Express, TypeScript, Prisma, PostgreSQL, CORS, tratamento de erros e estrutura modular.

## Stack obrigatória

- Node.js 20+
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod ou Joi
- bcrypt
- jsonwebtoken

## Estrutura esperada

```txt
src/
  app.ts
  server.ts
  config/
    env.ts
  modules/
    auth/
    users/
    services/
    barbers/
    appointments/
    admin/
  middlewares/
    authMiddleware.ts
    roleMiddleware.ts
    errorMiddleware.ts
    validateMiddleware.ts
  lib/
    prisma.ts
  utils/
    httpError.ts
prisma/
  schema.prisma
```

## Requisitos técnicos

- Configurar Express.
- Configurar CORS usando `CORS_ORIGIN`.
- Configurar parser JSON.
- Configurar middleware global de erro.
- Configurar rota `/health`.
- Configurar Prisma Client.
- Configurar validação de variáveis de ambiente.

## Endpoint obrigatório

```txt
GET /health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Scripts esperados

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  }
}
```

## Critérios de aceite

- API roda localmente.
- `/health` responde corretamente.
- Prisma está configurado.
- Build TypeScript funciona.
- `.env.example` criado.
