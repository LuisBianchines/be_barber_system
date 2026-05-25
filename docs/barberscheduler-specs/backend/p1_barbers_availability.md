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

# P1 — Barbeiros e Disponibilidade

## Objetivo

Implementar gerenciamento de barbeiros e horários de atendimento.

## Endpoints públicos

```txt
GET /barbers?active=true
GET /barbers/:id
```

## Endpoints administrativos

```txt
GET   /admin/barbers
POST  /admin/barbers
PATCH /admin/barbers/:id/toggle-active
GET   /admin/barbers/:id/availability
PUT   /admin/barbers/:id/availability
```

## Criar barbeiro

### Payload

```json
{
  "name": "João Barbeiro",
  "email": "joao@barbearia.com",
  "password": "123456",
  "bio": "Especialista em corte degradê"
}
```

### Regras

- Criar usuário com role `BARBER`.
- Criar registro em `Barber` vinculado ao usuário.
- Senha deve ser hasheada.

## Disponibilidade

### Payload de disponibilidade

```json
{
  "items": [
    {
      "weekday": 1,
      "startTime": "09:00",
      "endTime": "18:00",
      "active": true
    }
  ]
}
```

## Regras de validação

- `weekday` deve estar entre 0 e 6.
- `startTime` deve ser menor que `endTime`.
- Formato de horário: `HH:mm`.

## Critérios de aceite

- Admin cria barbeiro.
- Admin define disponibilidade.
- Cliente lista barbeiros ativos.
