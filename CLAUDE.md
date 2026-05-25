# Instruções para Agente de IA — Backend BarberScheduler

## 1. Contexto do Projeto

O BarberScheduler é um sistema acadêmico para gerenciamento de agendamentos de uma barbearia. O backend deve fornecer uma API REST para autenticação, cadastro de usuários, serviços, barbeiros, disponibilidade e agendamentos.

O sistema deve ser simples o suficiente para um MVP de faculdade, mas organizado com boas práticas reais de backend, segurança, validação e separação de responsabilidades.

## 2. Stack Técnica Obrigatória

Use preferencialmente:

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- bcrypt para hash de senha
- Zod para validação de entrada
- dotenv para variáveis de ambiente
- cors para liberação do frontend
- helmet para headers básicos de segurança
- ESLint e Prettier

NestJS é uma alternativa válida, mas Express é recomendado para manter o projeto acadêmico mais simples.

## 3. Objetivo do Backend

A API deve permitir:

- Cadastro e autenticação de usuários
- Controle de perfis: cliente, barbeiro e administrador
- CRUD de serviços da barbearia
- CRUD ou configuração de barbeiros
- Cadastro de disponibilidade dos barbeiros
- Consulta de horários disponíveis
- Criação de agendamento
- Cancelamento e reagendamento
- Visualização de agenda por barbeiro
- Relatórios simples de agendamentos e cancelamentos

## 4. Arquitetura Recomendada

Use arquitetura em camadas:

```txt
Controller -> Service -> Repository -> Database
```

Responsabilidades:

- Controller: recebe requisição, chama validação e encaminha para service.
- Service: contém regra de negócio.
- Repository: acessa banco de dados via Prisma.
- Middleware: autenticação, autorização, tratamento de erros e validação.

## 5. Estrutura Recomendada de Pastas

```txt
src/
  server.ts
  app.ts
  config/
    env.ts
    cors.ts
  modules/
    auth/
      auth.controller.ts
      auth.routes.ts
      auth.service.ts
      auth.schemas.ts
      auth.types.ts
    users/
      users.controller.ts
      users.routes.ts
      users.service.ts
      users.repository.ts
      users.schemas.ts
      users.types.ts
    services/
      services.controller.ts
      services.routes.ts
      services.service.ts
      services.repository.ts
      services.schemas.ts
      services.types.ts
    barbers/
      barbers.controller.ts
      barbers.routes.ts
      barbers.service.ts
      barbers.repository.ts
      barbers.schemas.ts
      barbers.types.ts
    appointments/
      appointments.controller.ts
      appointments.routes.ts
      appointments.service.ts
      appointments.repository.ts
      appointments.schemas.ts
      appointments.types.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
    validate.middleware.ts
  lib/
    prisma.ts
    jwt.ts
    password.ts
  utils/
    date.ts
```

## 6. Modelagem Inicial do Banco

Use PostgreSQL com Prisma.

### Entidades principais

- User
- Service
- Barber
- BarberAvailability
- Appointment

### Exemplo de schema Prisma

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(CLIENT)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  barber       Barber?
  appointments Appointment[] @relation("ClientAppointments")
}

enum Role {
  CLIENT
  BARBER
  ADMIN
}

model Service {
  id              String   @id @default(uuid())
  name            String
  description     String?
  price           Decimal
  durationMinutes Int
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  appointments Appointment[]
}

model Barber {
  id        String   @id @default(uuid())
  userId    String   @unique
  bio       String?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user          User                 @relation(fields: [userId], references: [id])
  availability  BarberAvailability[]
  appointments  Appointment[]
}

model BarberAvailability {
  id        String @id @default(uuid())
  barberId  String
  weekday   Int
  startTime String
  endTime   String

  barber Barber @relation(fields: [barberId], references: [id])
}

model Appointment {
  id              String            @id @default(uuid())
  clientId        String
  barberId        String
  serviceId       String
  appointmentDate DateTime
  startTime       String
  endTime         String
  status          AppointmentStatus @default(SCHEDULED)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  client  User    @relation("ClientAppointments", fields: [clientId], references: [id])
  barber  Barber  @relation(fields: [barberId], references: [id])
  service Service @relation(fields: [serviceId], references: [id])
}

enum AppointmentStatus {
  SCHEDULED
  CANCELLED
  COMPLETED
}
```

## 7. Variáveis de Ambiente

Crie `.env.example`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

Nunca versionar `.env` real.

`JWT_SECRET` nunca deve ser hardcoded no código.

## 8. Autenticação

Use JWT para o MVP.

Fluxos mínimos:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Regras

- Senhas devem ser armazenadas com bcrypt.
- Nunca retornar `passwordHash` nas respostas.
- JWT deve conter apenas dados mínimos: `sub`, `role`, `email`.
- Rotas protegidas devem validar token no middleware.
- Rotas administrativas devem validar perfil.

Exemplo de payload:

```ts
{
  sub: user.id,
  email: user.email,
  role: user.role
}
```

## 9. Autorização por Perfil

Perfis:

- `CLIENT`: agenda e consulta seus próprios horários.
- `BARBER`: visualiza sua agenda e atualiza atendimentos.
- `ADMIN`: gerencia serviços, barbeiros e disponibilidade.

Exemplo de middleware:

```ts
export function requireRole(roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    return next();
  };
}
```

## 10. Endpoints Recomendados

### Auth

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/me
```

### Serviços

```txt
GET    /services
GET    /services/:id
POST   /services
PUT    /services/:id
DELETE /services/:id
```

### Barbeiros

```txt
GET    /barbers
GET    /barbers/:id
POST   /barbers
PUT    /barbers/:id
DELETE /barbers/:id
```

### Disponibilidade

```txt
GET    /barbers/:barberId/availability
POST   /barbers/:barberId/availability
PUT    /barbers/:barberId/availability/:id
DELETE /barbers/:barberId/availability/:id
```

### Agendamentos

```txt
GET    /appointments
GET    /appointments/my
GET    /appointments/barber/:barberId
GET    /appointments/available-slots
POST   /appointments
PATCH  /appointments/:id/cancel
PATCH  /appointments/:id/reschedule
PATCH  /appointments/:id/complete
```

## 11. Validação de Entrada

Use Zod em todos os endpoints que recebem body, params ou query.

Exemplo:

```ts
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    barberId: z.string().uuid(),
    serviceId: z.string().uuid(),
    appointmentDate: z.string().date(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
  }),
});
```

Nunca confiar em dados vindos do frontend.

## 12. Regra Principal de Agendamento

O sistema não pode permitir dois agendamentos ativos no mesmo intervalo para o mesmo barbeiro.

Valide:

- Serviço existe e está ativo.
- Barbeiro existe e está ativo.
- Cliente está autenticado.
- Data não está no passado.
- Horário está dentro da disponibilidade do barbeiro.
- Não existe conflito com outro agendamento `SCHEDULED`.

Regra de conflito:

```txt
Existe conflito quando:
startTime < novoEndTime E endTime > novoStartTime
```

Exemplo conceitual:

```ts
const conflict = await prisma.appointment.findFirst({
  where: {
    barberId,
    appointmentDate,
    status: 'SCHEDULED',
    startTime: { lt: newEndTime },
    endTime: { gt: newStartTime },
  },
});

if (conflict) {
  throw new AppError('Horário indisponível para este barbeiro.', 409);
}
```

## 13. Tratamento de Erros

Crie uma classe `AppError` e um middleware global de erro.

Exemplo:

```ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}
```

Middleware:

```ts
export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);

  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
```

Nunca retornar stack trace para o frontend.

## 14. Segurança

Obrigatório:

- Hash de senha com bcrypt.
- JWT secret via variável de ambiente.
- CORS limitado ao domínio do frontend.
- Helmet habilitado.
- Validação de entrada com Zod.
- Autorização por perfil.
- Não retornar dados sensíveis.
- Não logar senhas, tokens ou dados sensíveis.

Recomendado:

- Rate limiting em rotas públicas como login e cadastro.
- Expiração de token.
- Logs básicos de erros.
- Sanitização de respostas.

Para MVP acadêmico, pode usar `express-rate-limit` localmente. Em produção real, preferir rate limiting em edge/gateway.

## 15. CORS

Configurar CORS usando variável de ambiente:

```ts
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
```

No deploy, configurar `CORS_ORIGIN` com a URL da Vercel.

## 16. Deploy do Backend

O deploy recomendado é no Render.

### Passos esperados

1. Criar repositório no GitHub.
2. Criar serviço Web no Render.
3. Selecionar o repositório do backend.
4. Configurar variáveis de ambiente.
5. Configurar build command.
6. Configurar start command.
7. Executar migrations do Prisma.

### Build command

```bash
npm install && npx prisma generate && npm run build
```

### Start command

```bash
npm run start
```

### Scripts esperados

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy"
  }
}
```

Em produção no Render, após deploy, rodar migrations com:

```bash
npx prisma migrate deploy
```

## 17. Banco de Dados Gratuito

Use PostgreSQL em uma das opções:

- Supabase Free
- Neon Free

Recomendação para faculdade: Supabase, por ter interface visual simples para verificar tabelas e registros.

O backend deve acessar o banco apenas pela variável `DATABASE_URL`.

## 18. Migrations

Toda alteração de banco deve ser feita via Prisma Migrate.

Não alterar banco manualmente sem refletir no schema Prisma.

Fluxo local:

```bash
npx prisma migrate dev --name create_initial_tables
```

Fluxo produção:

```bash
npx prisma migrate deploy
```

## 19. Seeds

Crie um seed opcional para facilitar apresentação.

Dados recomendados:

- 1 usuário admin
- 2 barbeiros
- 4 serviços
- Horários disponíveis de segunda a sábado

Exemplo de serviços:

- Corte masculino
- Barba
- Corte + barba
- Sobrancelha

Nunca usar senha real em seed. Usar senha acadêmica simples documentada no README, como:

```txt
admin@barberscheduler.com
123456
```

Apenas para ambiente de demonstração.

## 20. Testes Recomendados

Para MVP acadêmico, implementar pelo menos:

- Teste de cadastro de usuário
- Teste de login
- Teste de criação de serviço por admin
- Teste de criação de agendamento
- Teste impedindo agendamento duplicado no mesmo horário

Ferramentas possíveis:

- Vitest ou Jest
- Supertest

## 21. Logs

Usar logs simples para desenvolvimento e apresentação:

- Erros internos
- Inicialização do servidor
- Falha de conexão com banco

Não logar:

- Senhas
- Tokens JWT
- Headers Authorization
- Dados sensíveis desnecessários

## 22. README Obrigatório

O backend deve conter README com:

- Descrição do projeto
- Stack usada
- Como rodar localmente
- Como configurar `.env`
- Como rodar migrations
- Como rodar seeds
- Lista de endpoints
- URL do deploy

## 23. Critérios de Aceite

Uma funcionalidade só deve ser considerada pronta quando:

- Endpoint está implementado.
- Entrada é validada com Zod.
- Regra de negócio está no service.
- Acesso ao banco está no repository ou camada equivalente.
- Erros são tratados corretamente.
- Dados sensíveis não são retornados.
- Permissões por perfil foram respeitadas.
- Funciona localmente e no deploy.

## 24. O que Evitar

- Colocar regra de negócio diretamente na rota.
- Retornar senha ou hash de senha.
- Usar `any` sem justificativa.
- Fazer SQL manual desnecessário se Prisma resolve.
- Ignorar conflito de agendamento.
- Permitir que cliente crie agendamento para outro cliente.
- Permitir que barbeiro visualize agenda de outro barbeiro sem autorização adequada.
- Deixar CORS aberto com `*` em produção.
- Hardcode de secrets.
- Criar endpoints sem validação.

## 25. Checklist Final do Backend

Antes da entrega:

- [ ] Projeto roda com `npm install` e `npm run dev`.
- [ ] `.env.example` existe.
- [ ] Prisma configurado.
- [ ] Migrations criadas.
- [ ] Cadastro de usuário funcionando.
- [ ] Login funcionando.
- [ ] JWT funcionando.
- [ ] Rotas protegidas funcionando.
- [ ] Perfis CLIENT, BARBER e ADMIN funcionando.
- [ ] CRUD de serviços funcionando.
- [ ] Cadastro/listagem de barbeiros funcionando.
- [ ] Disponibilidade de barbeiro funcionando.
- [ ] Criação de agendamento funcionando.
- [ ] Conflito de horário bloqueado.
- [ ] Cancelamento funcionando.
- [ ] Reagendamento funcionando.
- [ ] Deploy no Render funcionando.
- [ ] Banco Supabase ou Neon conectado.
- [ ] README completo.
