import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../lib/password';
import { signToken } from '../../lib/jwt';
import { AppError } from '../../middlewares/app-error';
import { RegisterInput, LoginInput } from './auth.types';

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError('E-mail já cadastrado.', 409);

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError('Credenciais inválidas.', 401);

  const valid = await comparePassword(data.password, user.passwordHash);
  if (!valid) throw new AppError('Credenciais inválidas.', 401);

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
