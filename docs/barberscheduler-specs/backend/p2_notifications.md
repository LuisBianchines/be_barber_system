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

# P2 — Notificações por E-mail ou Mock de Notificação

## Objetivo

Preparar o backend para enviar ou simular notificações de confirmação, cancelamento e lembrete de agendamento.

## Escopo do MVP

Para faculdade, pode implementar inicialmente como mock/log no console. Envio real por SMTP é opcional.

## Eventos de notificação

- Agendamento criado.
- Agendamento cancelado.
- Lembrete futuro, se houver tempo.

## Interface esperada

Criar serviço:

```ts
interface NotificationService {
  sendAppointmentCreated(input: AppointmentNotificationInput): Promise<void>;
  sendAppointmentCancelled(input: AppointmentNotificationInput): Promise<void>;
}
```

## Implementação mínima

- Criar `ConsoleNotificationService`.
- Logar mensagem clara no console.
- Não bloquear criação do agendamento se notificação falhar.

## Implementação opcional com SMTP

Variáveis:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Segurança

- Nunca hardcodar usuário/senha de SMTP.
- Não logar secrets.
- Não enviar dados sensíveis desnecessários.

## Critérios de aceite

- Ao criar agendamento, notificação mock é disparada.
- Ao cancelar, notificação mock é disparada.
- Falha de notificação não quebra regra principal.
