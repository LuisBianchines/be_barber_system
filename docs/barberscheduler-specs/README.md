# BarberScheduler — Pacote de Specs para Agente de IA

Este pacote contém duas pastas principais:

```txt
frontend/
backend/
```

Cada pasta possui specs `.md` priorizadas por feature.

## Convenção de prioridade

- `p0_`: essencial para iniciar o projeto e entregar MVP.
- `p1_`: fluxo principal de negócio.
- `p2_`: administração e funcionalidades complementares.
- `p3_`: deploy, testes, polimento e segurança final.

## Como usar com agente de IA

1. Envie primeiro o `README.md` da pasta correspondente.
2. Depois envie uma spec por vez, respeitando a ordem de prioridade.
3. Peça para o agente implementar somente o escopo da spec atual.
4. Ao final de cada spec, peça para validar build, lint e execução local.

## Stack definida

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Vercel

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Render
- Supabase ou Neon para banco
