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

# P0 — Autenticação, Cadastro, Login e Perfis

## Objetivo

Implementar autenticação JWT com cadastro de cliente, login e controle de acesso por perfil.

## Endpoints

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

## POST /auth/register

### Payload

```json
{
  "name": "Luis",
  "email": "luis@email.com",
  "password": "123456"
}
```

### Regras

- Criar usuário com role `CLIENT` por padrão.
- E-mail deve ser único.
- Senha deve ter no mínimo 6 caracteres.
- Senha deve ser salva com bcrypt.
- Nunca retornar `passwordHash`.

## POST /auth/login

### Payload

```json
{
  "email": "luis@email.com",
  "password": "123456"
}
```

### Resposta

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Luis",
    "email": "luis@email.com",
    "role": "CLIENT"
  }
}
```

## GET /auth/me

- Exige JWT.
- Retorna usuário autenticado sem senha.

## Middlewares obrigatórios

- `authMiddleware`: valida JWT.
- `roleMiddleware`: valida perfil permitido.

## Segurança

- Usar `JWT_SECRET` via variável de ambiente.
- Não aceitar senha vazia.
- Mensagem de login inválido deve ser genérica.
- Não retornar se o e-mail existe ou não.

## Critérios de aceite

- Cadastro funciona.
- Login retorna JWT.
- `/auth/me` funciona com token válido.
- Rotas protegidas bloqueiam token ausente/inválido.
