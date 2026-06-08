# Spec — Criar README do Backend BarberSystem

## Repositório alvo

```txt
LuisBianchines/be_barber_system
```

## Objetivo

Criar um README profissional para o backend do **BarberSystem**, explicando como configurar e publicar a API Node.js no **Render**, usando banco PostgreSQL no **Supabase**.

Atualmente o repositório backend não possui `README.md`. Deve ser criado um README completo com instruções focadas em deploy, configuração de ambiente e integração com frontend Vercel.

---

## Stack atual identificada

O backend usa:

```txt
Node.js
TypeScript
Express
Prisma
PostgreSQL
JWT
bcrypt
Zod
Helmet
CORS
Express Rate Limit
Vitest
Render
Supabase
```

Scripts existentes no `package.json`:

```bash
npm run dev
npm run build
npm start
npm run lint
npm run format
npm run format:check
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run test
npm run test:watch
npm run seed
```

O comando de produção atual é:

```bash
prisma migrate deploy && node dist/server.js
```

O Prisma usa `DATABASE_URL` e `DIRECT_URL` no `schema.prisma`.

O `.env.example` atual contém:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

Como o schema Prisma exige `DIRECT_URL`, o README deve orientar a adicionar também essa variável e recomendar atualizar o `.env.example`.

---

## README esperado

Criar o arquivo:

```txt
README.md
```

---

# BarberSystem — Backend

## Descrição

Explicar que este repositório contém a API backend do **BarberSystem**, sistema de agendamento para barbearias.

A API é responsável por:

- Autenticação de clientes, administradores e barbeiros.
- Cadastro e gerenciamento de serviços.
- Cadastro e gerenciamento de barbeiros.
- Configuração de disponibilidade de barbeiros.
- Criação, listagem e cancelamento de agendamentos.
- Controle de perfis por role.
- Integração com PostgreSQL via Prisma.
- Segurança básica com Helmet, CORS, Rate Limit, JWT e validação de dados.

---

## Arquitetura de deploy

Adicionar diagrama textual:

```txt
Frontend React/Vite — Vercel
  |
  v
Backend Node.js/Express — Render
  |
  v
PostgreSQL — Supabase
```

Explicar:

- O Render hospeda a API.
- O Supabase hospeda o PostgreSQL.
- A Vercel consome a API pela URL pública do Render.
- O Prisma executa migrations no deploy.

---

## Tecnologias

Listar:

```txt
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

Para publicar o backend, a pessoa precisa de:

```txt
Conta no GitHub
Conta no Render
Conta no Supabase
Projeto PostgreSQL criado no Supabase
Node.js 20+ para build/testes
URL do frontend publicado na Vercel para configurar CORS
```

---

## Variáveis de ambiente

Criar tabela:

| Variável | Obrigatória | Exemplo | Descrição |
|---|---|---|---|
| `DATABASE_URL` | Sim | `postgresql://...` | URL principal usada pelo Prisma/app |
| `DIRECT_URL` | Sim | `postgresql://...` | URL direta usada pelo Prisma em migrations |
| `JWT_SECRET` | Sim | `uma-chave-grande-e-segura` | Chave para assinar JWT |
| `JWT_EXPIRES_IN` | Não | `1d` | Tempo de expiração do token |
| `PORT` | Não | `3000` | Porta local; no Render geralmente é injetada |
| `CORS_ORIGIN` | Sim | `https://barber-system-beta.vercel.app` | URL do frontend autorizado |
| `NODE_ENV` | Sim | `production` | Ambiente da aplicação |

---

## Atualizar `.env.example`

Instruir o agente a atualizar `.env.example` para incluir `DIRECT_URL` e exemplos de produção:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="change-me-use-a-secure-random-string"
JWT_EXPIRES_IN="1d"
PORT=3000
CORS_ORIGIN="https://barber-system-beta.vercel.app"
NODE_ENV="production"
```

Explicar que valores reais não devem ser commitados.

---

## Configuração do Supabase

Criar passo a passo:

1. Criar conta no Supabase.
2. Criar novo projeto.
3. Definir senha do banco.
4. Aguardar o projeto ficar ativo.
5. Ir em **Project Settings > Database**.
6. Copiar as connection strings.

Explicar a recomendação:

```txt
DATABASE_URL = URL do pooler ou URL compatível para app
DIRECT_URL = URL direta do banco para migrations Prisma
```

Se usar Supabase Pooler, orientar cuidado com:

- Usuário no formato `postgres.<project-ref>`.
- Senha correta.
- SSL habilitado quando exigido.
- Projeto ativo, não pausado.

---

## Configuração do Render

Criar passo a passo:

1. Entrar no Render.
2. Clicar em **New + > Web Service**.
3. Conectar ao GitHub.
4. Selecionar o repositório `be_barber_system`.
5. Configurar:

```txt
Environment: Node
Branch: main
Build Command: npm ci && npm run build
Start Command: npm start
```

6. Adicionar variáveis de ambiente:

```env
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://url-do-frontend.vercel.app
NODE_ENV=production
```

7. Fazer deploy.

---

## Migrations Prisma no deploy

Explicar que o comando de produção executa:

```bash
prisma migrate deploy && node dist/server.js
```

Ou seja:

1. Aplica migrations pendentes.
2. Só depois inicia o servidor.

Isso é importante porque se o banco estiver indisponível, o backend não sobe.

Adicionar observação:

```txt
Se o Render falhar durante prisma migrate deploy, verifique DATABASE_URL, DIRECT_URL, status do Supabase e senha do banco.
```

---

## Seed inicial

Documentar o script:

```bash
npm run seed
```

Explicar que ele deve criar dados iniciais, como:

```txt
Usuário admin
Serviços padrão
Barbeiros padrão
Disponibilidades padrão
```

Caso o seed exista, explicar como rodar no Render via Shell ou localmente com as variáveis corretas.

Se o Render não tiver shell disponível no plano atual, orientar rodar temporariamente a partir da máquina do desenvolvedor apontando para o banco Supabase, com muito cuidado para não commitar `.env`.

---

## Endpoints principais

Documentar os principais grupos de rotas:

```txt
GET    /health

POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /services
GET    /barbers
GET    /barbers/:id

POST   /appointments
GET    /appointments
PATCH  /appointments/:id/cancel

/admin/services
/admin/barbers
/admin/reports

/barber
```

Não precisa documentar payload completo de todos os endpoints, mas o README deve dar visão geral.

---

## Health check

Documentar:

```txt
GET /health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

Explicar que após deploy no Render, a primeira validação deve ser acessar:

```txt
https://sua-api.onrender.com/health
```

---

## Integração com frontend

Explicar:

No backend Render:

```env
CORS_ORIGIN=https://barber-system-beta.vercel.app
```

No frontend Vercel:

```env
VITE_API_BASE_URL=https://sua-api.onrender.com
```

Ambos precisam apontar um para o outro.

---

## Deploy automático

Explicar que após conectar o Render ao GitHub:

- Push na branch principal gera novo deploy.
- O Render executa build e start automaticamente.
- As variáveis de ambiente ficam configuradas no painel do Render.
- Secrets nunca devem ser versionados no GitHub.

---

## Troubleshooting

Adicionar seção com problemas comuns.

### 1. Erro `tenant/user not found` no Supabase

Causas prováveis:

- Projeto Supabase pausado.
- Projeto Supabase deletado.
- Connection string antiga.
- Usuário do pooler incorreto.
- `DATABASE_URL` apontando para project-ref errado.

Solução:

- Entrar no Supabase.
- Verificar se o projeto está ativo.
- Copiar novamente `DATABASE_URL` e `DIRECT_URL`.
- Atualizar variáveis no Render.
- Fazer redeploy.

### 2. Backend não sobe no Render

Verificar:

- Logs do Render.
- `DATABASE_URL`.
- `DIRECT_URL`.
- `JWT_SECRET`.
- Build command.
- Start command.
- Status do banco.

### 3. Erro de CORS no frontend

Verificar:

```env
CORS_ORIGIN=https://url-correta-da-vercel.vercel.app
```

Depois redeployar backend.

### 4. Login retorna 401

Causas:

- Usuário não existe.
- Senha incorreta.
- Seed não rodou.
- Role incorreta.
- Banco apontando para outro projeto.

### 5. Prisma migrate falha

Verificar:

- Banco ativo.
- URL direta correta.
- SSL.
- Migrations existentes.
- Permissões do usuário do banco.

---

## Segurança

Adicionar boas práticas:

- Nunca commitar `.env`.
- Usar `JWT_SECRET` forte.
- Usar HTTPS em produção.
- Liberar CORS apenas para a URL real do frontend.
- Não usar `*` em CORS em produção.
- Não expor senha de banco em README.
- Não criar usuários admin com senha fraca.
- Usar usuários E2E separados dos usuários reais.
- Rotas admin devem exigir role `ADMIN`.
- Rotas barbeiro devem exigir role `BARBER`.

---

## Checklist de publicação

Adicionar checklist:

```md
- [ ] Projeto Supabase criado e ativo.
- [ ] `DATABASE_URL` copiada corretamente.
- [ ] `DIRECT_URL` copiada corretamente.
- [ ] Serviço criado no Render.
- [ ] Build Command configurado como `npm ci && npm run build`.
- [ ] Start Command configurado como `npm start`.
- [ ] `JWT_SECRET` configurado.
- [ ] `CORS_ORIGIN` configurado com URL da Vercel.
- [ ] Deploy finalizado com sucesso.
- [ ] `/health` respondendo `status: ok`.
- [ ] Migrations aplicadas.
- [ ] Seed executado se necessário.
- [ ] Login admin funcionando.
- [ ] Login cliente funcionando.
- [ ] Login barbeiro funcionando.
```

---

## Critérios de aceite

O README será considerado pronto quando:

- [ ] Existir `README.md` na raiz do backend.
- [ ] O nome do sistema estiver como **BarberSystem**.
- [ ] README explicar arquitetura Render + Supabase + Vercel.
- [ ] README documentar todas as variáveis de ambiente.
- [ ] README orientar a configurar `DIRECT_URL`.
- [ ] `.env.example` estiver atualizado com `DIRECT_URL`.
- [ ] README explicar deploy no Render.
- [ ] README explicar configuração do Supabase.
- [ ] README explicar migrations Prisma no deploy.
- [ ] README documentar `/health`.
- [ ] README explicar integração com frontend.
- [ ] README incluir troubleshooting.
- [ ] README incluir checklist de publicação.
- [ ] README não focar em execução local como fluxo principal.
