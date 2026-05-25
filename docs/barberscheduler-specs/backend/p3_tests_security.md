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

# P3 — Testes, Segurança e Checklist Final

## Objetivo

Adicionar testes básicos e revisar segurança mínima antes da entrega do projeto.

## Testes mínimos recomendados

- Cadastro com dados válidos.
- Login com credenciais válidas.
- Login com senha inválida.
- Criar serviço como admin.
- Bloquear criação de serviço como cliente.
- Criar agendamento válido.
- Bloquear agendamento conflitante.
- Cancelar agendamento próprio.

## Ferramentas sugeridas

- Vitest ou Jest
- Supertest

## Checklist de segurança

- Senhas com bcrypt.
- JWT secret via ambiente.
- Rotas privadas protegidas.
- Rotas admin protegidas.
- Validação de payload com Zod/Joi.
- CORS restrito ao frontend.
- Não retornar `passwordHash`.
- Não logar senha/token.
- Não usar secrets hardcoded.

## Checklist operacional

- `.env.example` atualizado.
- `/health` funcionando.
- Build passando.
- Migrations documentadas.
- README com instruções de rodar localmente.

## Critérios de aceite

- Testes básicos passam.
- Fluxo principal validado manualmente.
- Sistema pronto para apresentação acadêmica.
