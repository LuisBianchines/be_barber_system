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

# P0 — Modelo de Dados com Prisma/PostgreSQL

## Objetivo

Criar o schema inicial do banco de dados para usuários, serviços, barbeiros, disponibilidade e agendamentos.

## Entidades obrigatórias

- User
- Service
- Barber
- BarberAvailability
- Appointment

## Enums obrigatórios

```prisma
enum UserRole {
  CLIENT
  BARBER
  ADMIN
}

enum AppointmentStatus {
  SCHEDULED
  CANCELLED
  COMPLETED
}
```

## Campos sugeridos

### User

```txt
id
name
email unique
passwordHash
role
createdAt
updatedAt
```

### Service

```txt
id
name
description
price
durationMinutes
active
createdAt
updatedAt
```

### Barber

```txt
id
userId unique
bio
active
createdAt
updatedAt
```

### BarberAvailability

```txt
id
barberId
weekday 0-6
startTime string HH:mm
endTime string HH:mm
active
createdAt
updatedAt
```

### Appointment

```txt
id
clientId
barberId
serviceId
appointmentDate DateTime
startTime string HH:mm
endTime string HH:mm
status
createdAt
updatedAt
```

## Índices importantes

- `User.email` único.
- Índice em `Appointment.barberId + appointmentDate + status`.
- Índice em `Appointment.clientId`.
- Índice em `BarberAvailability.barberId + weekday`.

## Regras de integridade

- Appointment deve referenciar cliente, barbeiro e serviço.
- Barber deve referenciar um usuário com role `BARBER` ou `ADMIN`, conforme regra implementada.
- Não deletar registros importantes no MVP; preferir inativar/cancelar.

## Critérios de aceite

- `prisma migrate dev` executa sem erro.
- Relações entre tabelas funcionando.
- Prisma Client gerado.
