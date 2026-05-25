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

# P2 — Relatórios Administrativos Simples

## Objetivo

Criar endpoints simples para o administrador consultar indicadores básicos da barbearia.

## Endpoint

```txt
GET /admin/reports/summary?startDate=&endDate=
```

## Indicadores mínimos

- Total de agendamentos no período.
- Total de agendamentos concluídos.
- Total de agendamentos cancelados.
- Serviços mais agendados.
- Barbeiros com mais atendimentos.

## Regras

- Endpoint exige perfil `ADMIN`.
- Se período não for informado, usar mês atual.
- Não precisa gerar PDF/Excel no MVP.

## Resposta esperada

```json
{
  "totalAppointments": 20,
  "completedAppointments": 15,
  "cancelledAppointments": 3,
  "scheduledAppointments": 2,
  "topServices": [],
  "topBarbers": []
}
```

## Critérios de aceite

- Admin consulta resumo.
- Filtros por período funcionam.
- Números refletem os dados do banco.
