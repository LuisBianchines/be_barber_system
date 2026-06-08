# BarberSystem — Backend

API REST do **BarberSystem**, sistema de agendamento para barbearias. Permite que clientes agendem horários online, administradores gerenciem serviços e barbeiros, e barbeiros acompanhem sua agenda.

A API é responsável por:

- Autenticação de clientes, administradores e barbeiros
- Cadastro e gerenciamento de serviços
- Cadastro e gerenciamento de barbeiros
- Configuração de disponibilidade de barbeiros
- Criação, listagem e cancelamento de agendamentos
- Controle de perfis por role (CLIENT, BARBER, ADMIN)
- Integração com PostgreSQL via Prisma
- Segurança com Helmet, CORS, Rate Limit, JWT e validação com Zod

---

## Arquitetura de deploy

```
Frontend React/Vite — Vercel
  |
  v
Backend Node.js/Express — Render
  |
  v
PostgreSQL — Supabase
```

- O **Render** hospeda a API Node.js
- O **Supabase** hospeda o PostgreSQL
- A **Vercel** consome a API pela URL pública do Render
- O **Prisma** executa migrations automaticamente no deploy

---

## Tecnologias

```
Node.js
TypeScript
Express
Prisma ORM
PostgreSQL
JWT
bcrypt
Zod
CORS
Helmet
Express Rate Limit
Vitest
Render
Supabase
```

---

## Pré-requisitos

Para publicar o backend você precisa de:

```
Conta no GitHub
Conta no Render (render.com)
Conta no Supabase (supabase.com)
Projeto PostgreSQL criado no Supabase
Node.js 20+ para build e testes locais
URL do frontend publicado na Vercel (para configurar CORS)
```

---

## Variáveis de ambiente

| Variável | Obrigatória | Exemplo | Descrição |
|---|---|---|---|
| `DATABASE_URL` | Sim | `postgresql://...` | URL principal usada pelo Prisma e pela aplicação |
| `DIRECT_URL` | Sim | `postgresql://...` | URL direta usada pelo Prisma nas migrations |
| `JWT_SECRET` | Sim | `uma-chave-grande-e-segura` | Chave para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Não | `1d` | Tempo de expiração do token (padrão: `1d`) |
| `PORT` | Não | `3000` | Porta local; no Render é injetada automaticamente |
| `CORS_ORIGIN` | Sim | `https://barber-system-beta.vercel.app` | URL do frontend autorizado |
| `NODE_ENV` | Sim | `production` | Ambiente da aplicação |

Copie `.env.example` para `.env` e preencha com seus valores reais. **Nunca commite o `.env`.**

---

## Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New project** e defina a senha do banco
3. Aguarde o projeto ficar ativo (pode levar alguns minutos)
4. Vá em **Project Settings > Database**
5. Copie as connection strings

### Qual URL usar para cada variável

O Prisma exige duas URLs distintas:

- **`DATABASE_URL`** — URL do pooler (usada pela aplicação em runtime)
- **`DIRECT_URL`** — URL de conexão direta (usada pelo Prisma nas migrations)

Você encontra ambas em **Project Settings > Database > Connection string**.

> **Atenção ao usar o Supabase Pooler:**
> - O usuário deve estar no formato `postgres.<project-ref>` (ex: `postgres.abcxyzproject`)
> - Confirme a senha correta do banco
> - Verifique se o projeto está ativo e não pausado
> - Se o Render não conseguir conectar, verifique se está usando o host e region corretos do pooler

---

## Configuração do Render

1. Acesse [render.com](https://render.com) e conecte sua conta GitHub
2. Clique em **New + > Web Service**
3. Selecione o repositório `be_barber_system`
4. Configure o serviço:

```
Environment:     Node
Branch:          main
Build Command:   npm ci && npm run build
Start Command:   npm start
```

5. Adicione as variáveis de ambiente no painel do Render:

```
DATABASE_URL=postgresql://postgres.<project-ref>:<senha>@<pooler-host>:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.<project-ref>:<senha>@<pooler-host>:5432/postgres
JWT_SECRET=<uma-chave-secreta-longa-e-aleatória>
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://sua-url.vercel.app
NODE_ENV=production
```

6. Clique em **Create Web Service** para iniciar o primeiro deploy

O Render fará deploy automaticamente a cada push na branch `main`.

---

## Migrations Prisma no deploy

O comando de produção executa automaticamente:

```bash
prisma migrate deploy && node dist/server.js
```

Ou seja:

1. Aplica todas as migrations pendentes no banco
2. Só então inicia o servidor

Isso garante que o banco esteja sempre atualizado antes da API responder. Se o banco estiver indisponível, o backend não sobe.

> Se o Render falhar durante `prisma migrate deploy`, verifique `DATABASE_URL`, `DIRECT_URL`, status do Supabase e a senha do banco.

---

## Seed inicial

O projeto inclui um script de seed para criar dados iniciais:

```bash
npm run seed
```

O seed cria (ou atualiza) o usuário administrador:

```
E-mail:  admin@barberscheduler.com
Senha:   admin123
```

> Você pode sobrescrever esses valores com as variáveis `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME`.

**Como rodar o seed:**

Opção 1 — localmente, apontando para o banco Supabase:
```bash
# Configure .env com DATABASE_URL e DIRECT_URL apontando para o Supabase
npm run seed
```

Opção 2 — via Shell do Render (planos pagos):
```bash
npm run seed
```

> No plano gratuito do Render não há acesso a shell. Nesse caso, rode o seed localmente com o `.env` apontando para o banco de produção (Supabase). Nunca commite o `.env` com credenciais reais.

---

## Endpoints principais

```
GET    /health                          Health check público

POST   /auth/register                   Cadastro de cliente
POST   /auth/login                      Login (retorna token JWT)
GET    /auth/me                         Dados do usuário logado

GET    /services                        Lista serviços ativos
GET    /barbers                         Lista barbeiros ativos
GET    /barbers/:id                     Detalhe de um barbeiro

GET    /appointments/available-slots    Horários disponíveis
POST   /appointments                    Criar agendamento (CLIENT)
GET    /appointments/me                 Meus agendamentos
PATCH  /appointments/:id/cancel         Cancelar agendamento
PATCH  /appointments/:id/reschedule     Reagendar (CLIENT)

GET    /barber/appointments             Agenda do barbeiro logado (BARBER/ADMIN)

GET    /admin/services                  Gerenciar serviços (ADMIN)
POST   /admin/services
PUT    /admin/services/:id
PATCH  /admin/services/:id/toggle-active

GET    /admin/barbers                   Gerenciar barbeiros (ADMIN)
POST   /admin/barbers
PATCH  /admin/barbers/:id/toggle-active
GET    /admin/barbers/:id/availability
PUT    /admin/barbers/:id/availability

GET    /admin/reports/summary           Relatório de agendamentos (ADMIN)
```

Para documentação completa com payloads e exemplos, veja [`docs/frontend-integration.md`](docs/frontend-integration.md) e [`docs/openapi.yml`](docs/openapi.yml).

---

## Health check

Após o deploy, a primeira validação deve ser:

```
GET https://sua-api.onrender.com/health
```

Resposta esperada:

```json
{ "status": "ok" }
```

---

## Integração com frontend

No backend (variável no Render):

```env
CORS_ORIGIN=https://barber-system-beta.vercel.app
```

No frontend (variável na Vercel):

```env
VITE_API_BASE_URL=https://be-barber-system.onrender.com
```

Ambos precisam apontar um para o outro. Se o CORS estiver bloqueando, verifique se a URL no `CORS_ORIGIN` bate exatamente com a origem do frontend (sem barra no final).

---

## Deploy automático

Após conectar o Render ao GitHub:

- Cada push na branch `main` dispara um novo deploy automaticamente
- O Render executa build e start sem intervenção manual
- As variáveis de ambiente ficam configuradas no painel do Render
- Secrets nunca devem ser versionados no GitHub

---

## Troubleshooting

### 1. Erro `tenant/user not found` no Supabase

Causas prováveis:
- Projeto Supabase pausado (plano gratuito pausa após inatividade)
- Connection string antiga ou com project-ref errado
- Usuário do pooler no formato incorreto (deve ser `postgres.<project-ref>`)

Solução:
1. Entre no Supabase e verifique se o projeto está ativo
2. Vá em **Project Settings > Database** e copie as URLs novamente
3. Atualize `DATABASE_URL` e `DIRECT_URL` no Render
4. Faça redeploy

### 2. Backend não sobe no Render

Verifique nos logs do Render:
- `DATABASE_URL` e `DIRECT_URL` estão corretas
- `JWT_SECRET` está configurado
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Status do Supabase (ativo, não pausado)

### 3. Erro de CORS no frontend

```env
CORS_ORIGIN=https://url-correta-da-vercel.vercel.app
```

Após atualizar a variável no Render, faça redeploy do backend.

### 4. Login retorna 401

Causas:
- Usuário não existe no banco (seed não rodou)
- Senha incorreta
- Banco apontando para projeto errado

Solução: rode `npm run seed` e verifique `DATABASE_URL`.

### 5. `prisma migrate deploy` falha no startup

Verifique:
- Banco ativo e acessível
- `DIRECT_URL` apontando para conexão direta (não pooler de transaction mode)
- Senha correta e sem caracteres especiais não codificados (use `%40` para `@`)
- Migrations existem em `prisma/migrations/`

---

## Segurança

- Nunca commite `.env` com valores reais
- Use `JWT_SECRET` longa e aleatória (mínimo 32 caracteres)
- Use HTTPS em produção (Render e Vercel já fornecem)
- Configure `CORS_ORIGIN` apenas com a URL real do frontend — nunca use `*` em produção
- Não exponha senhas de banco em README ou em código
- Rotas `/admin/*` exigem role `ADMIN`
- Rotas `/barber/*` exigem role `BARBER` ou `ADMIN`

---

## Checklist de publicação

- [ ] Projeto Supabase criado e ativo
- [ ] `DATABASE_URL` copiada corretamente
- [ ] `DIRECT_URL` copiada corretamente
- [ ] Serviço criado no Render
- [ ] Build Command configurado: `npm ci && npm run build`
- [ ] Start Command configurado: `npm start`
- [ ] `JWT_SECRET` configurado
- [ ] `CORS_ORIGIN` configurado com URL da Vercel
- [ ] Deploy finalizado com sucesso
- [ ] `/health` respondendo `{ "status": "ok" }`
- [ ] Migrations aplicadas sem erro
- [ ] Seed executado (usuário admin criado)
- [ ] Login admin funcionando
- [ ] Login cliente funcionando
- [ ] Login barbeiro funcionando
