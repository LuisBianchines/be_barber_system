# Guia de Integração — Frontend BarberScheduler

## Base URL

```
Produção:    https://be-barber-system.onrender.com
Desenvolvimento: http://localhost:3000
```

---

## Autenticação

A API usa **JWT Bearer Token**. Após o login, inclua o token em todas as requisições protegidas:

```http
Authorization: Bearer <token>
```

### Fluxo de autenticação

```
1. POST /auth/register  →  cria conta
2. POST /auth/login     →  recebe { token, user }
3. Armazena token (localStorage / cookie httpOnly)
4. Inclui token em toda requisição protegida
```

---

## Perfis (roles)

| Role    | Quem é                          | O que pode fazer                              |
|---------|---------------------------------|-----------------------------------------------|
| CLIENT  | Cliente da barbearia (padrão)   | Agendar, cancelar, reagendar os próprios agendamentos |
| BARBER  | Barbeiro                        | Ver própria agenda, completar atendimentos    |
| ADMIN   | Administrador                   | CRUD de tudo, relatórios                      |

---

## Endpoints

### Auth

#### `POST /auth/register`
Cria uma conta de cliente.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minimo6"
}
```

**Resposta 201:**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "CLIENT",
  "createdAt": "2026-05-25T15:00:00.000Z"
}
```

**Erros:** `400` validação · `409` e-mail já cadastrado

---

#### `POST /auth/login`
Autentica e retorna o token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "minimo6"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "CLIENT"
  }
}
```

**Erros:** `400` validação · `401` credenciais inválidas

---

#### `GET /auth/me` 🔒
Retorna dados do usuário logado a partir do token.

**Resposta 200:**
```json
{
  "sub": "uuid-do-usuario",
  "email": "joao@email.com",
  "role": "CLIENT"
}
```

---

### Serviços

#### `GET /services`
Lista serviços ativos. Sem autenticação.

**Query params (opcionais):**
```
active=false  →  inclui serviços inativos
```

**Resposta 200:**
```json
[
  {
    "id": "uuid",
    "name": "Corte masculino",
    "description": "Corte social ou degradê",
    "price": "35.00",
    "durationMinutes": 30,
    "active": true
  }
]
```

---

#### `GET /services/:id`
Detalhe de um serviço. Sem autenticação.

---

### Barbeiros

#### `GET /barbers`
Lista barbeiros ativos. Sem autenticação.

**Resposta 200:**
```json
[
  {
    "id": "uuid",
    "bio": "Especialista em degradê",
    "active": true,
    "user": {
      "id": "uuid",
      "name": "Carlos Barbeiro",
      "email": "carlos@barbearia.com"
    }
  }
]
```

---

#### `GET /barbers/:id`
Detalhe de um barbeiro. Sem autenticação.

---

### Agendamentos

#### `GET /appointments/available-slots` 🔒
Retorna os horários disponíveis de um barbeiro para um serviço e data.

**Query params (obrigatórios):**
```
barberId=uuid&serviceId=uuid&date=2026-06-10
```

**Resposta 200:**
```json
["09:00", "09:30", "10:00", "10:30", "14:00"]
```

> Os slots já excluem horários ocupados e consideram a duração do serviço.

---

#### `POST /appointments` 🔒 CLIENT
Cria um agendamento.

**Body:**
```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "appointmentDate": "2026-06-10",
  "startTime": "10:00"
}
```

**Resposta 201:**
```json
{
  "id": "uuid",
  "clientId": "uuid",
  "barberId": "uuid",
  "serviceId": "uuid",
  "appointmentDate": "2026-06-10T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "10:30",
  "status": "SCHEDULED",
  "createdAt": "..."
}
```

**Erros:** `400` data no passado · `404` serviço/barbeiro inativo · `409` conflito de horário

---

#### `GET /appointments/me` 🔒
Lista os agendamentos do usuário logado.

**Resposta 200:** array de objetos de agendamento (mesmo formato do POST).

---

#### `PATCH /appointments/:id/cancel` 🔒
Cancela um agendamento.

**Resposta 200:**
```json
{ "...": "...", "status": "CANCELLED" }
```

**Erros:** `400` já cancelado · `404` não encontrado

---

#### `PATCH /appointments/:id/reschedule` 🔒 CLIENT
Reagenda um agendamento existente.

**Body:**
```json
{
  "appointmentDate": "2026-06-15",
  "startTime": "14:00"
}
```

**Resposta 200:** objeto do agendamento atualizado.

---

#### `PATCH /appointments/:id/complete` 🔒 BARBER/ADMIN
Marca um agendamento como concluído.

---

### Agenda do barbeiro

#### `GET /barber/appointments` 🔒 BARBER/ADMIN
Retorna os agendamentos do barbeiro logado.

**Query params (opcional):**
```
date=2026-06-10  →  filtra por data específica
```

**Resposta 200:**
```json
[
  {
    "id": "uuid",
    "appointmentDate": "2026-06-10T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "SCHEDULED",
    "client": {
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "service": {
      "name": "Corte masculino",
      "durationMinutes": 30,
      "price": "35.00"
    }
  }
]
```

---

### Rotas Admin

Todas as rotas abaixo exigem `role: ADMIN`.

#### Serviços

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/admin/services` | Lista todos (ativos + inativos) |
| `POST` | `/admin/services` | Cria serviço |
| `PUT` | `/admin/services/:id` | Atualiza serviço |
| `PATCH` | `/admin/services/:id/toggle-active` | Ativa/desativa |

**Body POST/PUT:**
```json
{
  "name": "Corte masculino",
  "description": "Corte social ou degradê",
  "price": 35.00,
  "durationMinutes": 30
}
```

---

#### Barbeiros

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/admin/barbers` | Lista todos |
| `POST` | `/admin/barbers` | Cria barbeiro (cria user + barber) |
| `PATCH` | `/admin/barbers/:id/toggle-active` | Ativa/desativa |

**Body POST:**
```json
{
  "name": "Carlos Ferreira",
  "email": "carlos@barbearia.com",
  "password": "senha123",
  "bio": "Especialista em degradê"
}
```

---

#### Disponibilidade do barbeiro

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/admin/barbers/:barberId/availability` | Lista disponibilidade |
| `PUT` | `/admin/barbers/:barberId/availability` | Substitui toda a disponibilidade |

**Body PUT** (substitui todos os horários):
```json
{
  "items": [
    { "weekday": 1, "startTime": "09:00", "endTime": "18:00" },
    { "weekday": 2, "startTime": "09:00", "endTime": "18:00" },
    { "weekday": 3, "startTime": "09:00", "endTime": "18:00" },
    { "weekday": 4, "startTime": "09:00", "endTime": "18:00" },
    { "weekday": 5, "startTime": "09:00", "endTime": "18:00" },
    { "weekday": 6, "startTime": "09:00", "endTime": "13:00" }
  ]
}
```

> `weekday`: 0 = domingo, 1 = segunda, ..., 6 = sábado

---

#### Relatórios

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/admin/reports/summary` | Resumo de agendamentos |

**Query params (opcionais):**
```
startDate=2026-05-01&endDate=2026-05-31
```

---

## Formato de erros

Todos os erros seguem o padrão:

```json
{
  "message": "Descrição do erro."
}
```

| Código | Quando |
|--------|--------|
| `400` | Dados inválidos ou regra de negócio violada |
| `401` | Token ausente ou expirado |
| `403` | Perfil sem permissão |
| `404` | Recurso não encontrado |
| `409` | Conflito (e-mail duplicado, horário ocupado) |
| `500` | Erro interno do servidor |

---

## Exemplo de uso com fetch (TypeScript)

```ts
const BASE_URL = 'https://be-barber-system.onrender.com';

async function apiFetch<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Erro desconhecido');
  return data as T;
}

// Login
const { token, user } = await apiFetch<{ token: string; user: User }>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'joao@email.com', password: '123456' }),
});

// Slots disponíveis
const slots = await apiFetch<string[]>(
  `/appointments/available-slots?barberId=${barberId}&serviceId=${serviceId}&date=2026-06-10`,
  undefined,
  token,
);

// Criar agendamento
const appointment = await apiFetch('/appointments', {
  method: 'POST',
  body: JSON.stringify({ barberId, serviceId, appointmentDate: '2026-06-10', startTime: '10:00' }),
}, token);
```

---

## Fluxo típico do cliente

```
1. GET /barbers                       → listar barbeiros
2. GET /services                      → listar serviços
3. GET /appointments/available-slots  → escolher horário
4. POST /auth/register ou /auth/login → autenticar
5. POST /appointments                 → confirmar agendamento
6. GET /appointments/me               → ver meus agendamentos
7. PATCH /appointments/:id/cancel     → cancelar se necessário
```

## Fluxo típico do admin

```
1. POST /auth/login                          → autenticar como ADMIN
2. POST /admin/barbers                       → cadastrar barbeiro
3. PUT /admin/barbers/:id/availability       → definir horários
4. POST /admin/services                      → cadastrar serviços
5. GET /admin/reports/summary                → acompanhar relatórios
```
