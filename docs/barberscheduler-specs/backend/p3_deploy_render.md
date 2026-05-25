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

# P3 — Deploy do Backend no Render

## Objetivo

Preparar backend para deploy gratuito no Render usando PostgreSQL externo no Supabase ou Neon.

## Requisitos

- Build TypeScript funcionando.
- Start script funcionando.
- Variáveis de ambiente documentadas.
- CORS configurado para URL do frontend.

## Scripts esperados

```json
{
  "scripts": {
    "build": "tsc && prisma generate",
    "start": "node dist/server.js",
    "postinstall": "prisma generate"
  }
}
```

## Configuração no Render

- Environment: Node
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CORS_ORIGIN`
  - `PORT`

## Banco

- Usar Supabase ou Neon.
- Rodar migrations antes ou durante deploy conforme estratégia escolhida.
- Para projeto acadêmico, pode rodar migration local apontando para banco remoto.

## Cuidados

- Plano gratuito pode hibernar.
- Primeira requisição pode demorar.
- Não usar banco local em produção.
- Não commitar `.env`.

## Critérios de aceite

- API publicada no Render.
- `/health` responde publicamente.
- Frontend consegue consumir API.
- CORS configurado corretamente.
