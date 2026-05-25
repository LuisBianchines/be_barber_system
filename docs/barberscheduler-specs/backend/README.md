# BarberScheduler — Specs Backend

Esta pasta contém as specs para implementação do backend do BarberScheduler.

## Stack obrigatória

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod ou Joi para validação

## Ordem de implementação sugerida

1. `p0_project_setup.md`
2. `p0_database_schema.md`
3. `p0_auth_roles.md`
4. `p1_services_crud.md`
5. `p1_barbers_availability.md`
6. `p1_appointments.md`
7. `p2_admin_reports.md`
8. `p2_notifications.md`
9. `p3_deploy_render.md`
10. `p3_tests_security.md`

## Variáveis de ambiente

Criar `.env.example`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="change-me"
JWT_EXPIRES_IN="1d"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

## Regras gerais de API

- Todas as respostas devem ser JSON.
- Erros devem ter formato padronizado.
- Dados sensíveis nunca devem ser retornados.
- Todas as rotas privadas devem exigir JWT.
- Rotas administrativas devem exigir perfil `ADMIN`.
