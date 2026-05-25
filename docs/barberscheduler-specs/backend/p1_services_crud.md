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

# P1 — CRUD de Serviços

## Objetivo

Implementar cadastro e consulta de serviços oferecidos pela barbearia.

## Endpoints públicos

```txt
GET /services?active=true
GET /services/:id
```

## Endpoints administrativos

```txt
GET    /admin/services
POST   /admin/services
PUT    /admin/services/:id
PATCH  /admin/services/:id/toggle-active
```

## Payload de criação

```json
{
  "name": "Corte Masculino",
  "description": "Corte completo com acabamento",
  "price": 45,
  "durationMinutes": 30
}
```

## Validações

- `name` obrigatório.
- `price` deve ser maior ou igual a zero.
- `durationMinutes` deve ser maior que zero.
- `description` opcional.

## Regras

- Serviços não devem ser deletados fisicamente no MVP.
- Para remover da listagem pública, usar `active=false`.
- Listagem pública retorna apenas ativos quando `active=true`.

## Segurança

- Rotas `/admin/*` exigem perfil `ADMIN`.
- Rotas públicas não exigem login.

## Critérios de aceite

- Admin cria, edita e ativa/inativa serviço.
- Cliente lista serviços ativos.
- Validação impede payload inválido.
