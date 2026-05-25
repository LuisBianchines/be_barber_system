import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { corsOptions } from './config/cors';
import { errorMiddleware } from './middlewares/error.middleware';

import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { servicesRouter } from './modules/services/services.routes';
import { barbersRouter } from './modules/barbers/barbers.routes';
import { appointmentsRouter } from './modules/appointments/appointments.routes';
import { barberRouter } from './modules/appointments/appointments.barber.routes';
import { adminRouter } from './modules/admin/admin.routes';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
app.use('/auth', publicLimiter);

app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/services', servicesRouter);
app.use('/barbers', barbersRouter);
app.use('/appointments', appointmentsRouter);
app.use('/barber', barberRouter);
app.use('/admin', adminRouter);

app.use(errorMiddleware);

export { app };
