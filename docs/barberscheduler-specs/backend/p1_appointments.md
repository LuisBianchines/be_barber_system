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

# P1 — Agendamentos e Disponibilidade de Horários

## Objetivo

Implementar a regra principal do sistema: criação, listagem, cancelamento e conclusão de agendamentos, evitando conflito de horários.

## Endpoints

```txt
GET  /appointments/available-slots?barberId=&serviceId=&date=
POST /appointments
GET  /appointments/me
PATCH /appointments/:id/cancel
PATCH /appointments/:id/complete
GET  /barber/appointments?date=YYYY-MM-DD
```

## Criar agendamento

### Payload

```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "appointmentDate": "2026-06-10",
  "startTime": "14:00"
}
```

## Regras de negócio

- Apenas cliente autenticado pode criar agendamento para si mesmo.
- Serviço deve existir e estar ativo.
- Barbeiro deve existir e estar ativo.
- Data não pode ser passada.
- Horário deve estar dentro da disponibilidade do barbeiro.
- `endTime` deve ser calculado com base na duração do serviço.
- Não permitir conflito com outro agendamento `SCHEDULED` do mesmo barbeiro.

## Regra de conflito

Um novo agendamento conflita quando:

```txt
existing.startTime < newEndTime AND existing.endTime > newStartTime
```

## Geração de horários disponíveis

- Buscar disponibilidade do barbeiro para o dia da semana.
- Gerar slots com base na duração do serviço.
- Remover slots conflitantes com agendamentos já existentes.
- Retornar horários em formato `HH:mm`.

## Cancelamento

- Cliente pode cancelar seus próprios agendamentos futuros.
- Admin pode cancelar qualquer agendamento.
- Não cancelar agendamento já concluído.

## Conclusão

- Barbeiro ou admin pode marcar como `COMPLETED`.
- Não concluir agendamento cancelado.

## Segurança

- Validar ownership: cliente não pode cancelar agendamento de outro cliente.
- Barbeiro não pode concluir agendamento de outro barbeiro, exceto admin.

## Critérios de aceite

- Cliente cria agendamento válido.
- Sistema bloqueia conflito de horário.
- Cliente lista e cancela seus agendamentos.
- Barbeiro visualiza agenda do dia.
- Barbeiro conclui atendimento.
